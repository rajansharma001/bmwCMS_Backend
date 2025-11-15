import { Request, Response } from "express";
import mongoose from "mongoose";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { VehicleQuotationTableModel } from "../../../model/quotationModel/vehicleQuotationTable";
import { VehicleQuotationType } from "../../../types/vehicleQuotationType";
import { clientType } from "../../../types/clientTypes";
import { vehicleQuotationTableType } from "../../../types/vehicleQuotationTableTypes";

export const updateQuotation = async (req: Request, res: Response) => {
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
    const _id = req.params.id;

    // Validate required fields
    if (!_id) {
      return res.status(400).json({ error: "Quotation ID is required." });
    }

    // Find existing quotation
    const existingQuotation = await VehicleQuotationModel.findById(_id)
      .session(session)
      .lean<VehicleQuotationType>();

    if (!existingQuotation) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Quotation not found." });
    }

    // Check client existence
    const clientData = await ClientsModel.findById(clientId)
      .session(session)
      .lean<clientType>();

    if (!clientData) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Client not found." });
    }

    // Update main quotation
    const updatedQuotation = await VehicleQuotationModel.findByIdAndUpdate(
      _id,
      {
        clientId: clientData._id,
        date: date ?? existingQuotation.date,
        totalAmount: totalAmount ?? existingQuotation.totalAmount,
        status: status ?? existingQuotation.status,
        termsAndConditions:
          termsAndConditions ?? existingQuotation.termsAndConditions,
      },
      { new: true, session }
    );

    if (!updatedQuotation) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Quotation update failed." });
    }

    // Update quotation table(s)
    if (Array.isArray(tableRows) && tableRows.length > 0) {
      // Remove existing quotation tables
      await VehicleQuotationTableModel.deleteMany({ quotationId: _id }).session(
        session
      );

      // Insert updated table rows
      const updatedTableEntries = tableRows.map((item: any) => ({
        quotationId: _id,
        vehicleId: item.vehicleId,
        noOfDays: item.noOfDays,
        ratePerDay: item.ratePerDay,
        total: item.total,
      }));

      await VehicleQuotationTableModel.insertMany(updatedTableEntries, {
        session,
      });
    }

    const updatedQuotationObj =
      updatedQuotation.toObject<VehicleQuotationType>();
    const updatedQuotationTables = await VehicleQuotationTableModel.find({
      quotationId: _id,
    })
      .session(session)
      .lean<vehicleQuotationTableType[]>();

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Quotation updated successfully.",
      updatedQuotation: updatedQuotationObj,
      updatedQuotationTable: updatedQuotationTables,
    });
  } catch (error: any) {
    console.error("Error updating quotation:", error);
    await session.abortTransaction();
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
};
