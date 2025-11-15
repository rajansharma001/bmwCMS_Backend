import { Request, Response } from "express";
import mongoose from "mongoose";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { VehicleQuotationTableModel } from "../../../model/quotationModel/vehicleQuotationTable";
import { VehicleQuotationType } from "../../../types/vehicleQuotationType";
import { clientType } from "../../../types/clientTypes";
import { vehicleQuotationTableType } from "../../../types/vehicleQuotationTableTypes";

export const newQuotation = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      clientId,
      date,
      totalAmount,
      status,
      termsAndConditions,
      tableRows,
    } = req.body;

    console.log("Payload received:", req.body);

    // Validate required fields
    if (!clientId || !status || !date || !termsAndConditions) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Check if client exists
    const checkClientExists = await ClientsModel.findById(clientId)
      .session(session)
      .lean<clientType>();

    if (!checkClientExists) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Client not found." });
    }

    // Create quotation
    const [createQuotation] = await VehicleQuotationModel.create(
      [
        {
          date,
          clientId: checkClientExists._id,
          totalAmount,
          status,
          termsAndConditions,
        },
      ],
      { session }
    );

    // Validate tableRows
    if (!Array.isArray(tableRows) || tableRows.length === 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ error: "Quotation table data is required." });
    }

    // Prepare table entries
    const tableEntries = tableRows.map((item: any) => ({
      quotationId: createQuotation._id,
      vehicleId: item.vehicleId,
      noOfDays: item.noOfDays,
      ratePerDay: item.ratePerDay,
      total: item.total,
    }));

    // Insert quotation tables
    const newQuotationTables = await VehicleQuotationTableModel.insertMany(
      tableEntries,
      {
        session,
      }
    );

    // Convert to plain JS objects
    const createQuotationObj = createQuotation.toObject<VehicleQuotationType>();
    const newQuotationTablesObj = newQuotationTables.map((q) =>
      q.toObject<vehicleQuotationTableType>()
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "New quotation created successfully",
      createQuotation: createQuotationObj,
      newQuotationTable: newQuotationTablesObj,
    });
  } catch (error: any) {
    console.error("Error creating quotation:", error);
    await session.abortTransaction();
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
};
