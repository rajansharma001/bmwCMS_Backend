import { Request, Response } from "express";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { VehicleQuotationTableModel } from "../../../model/quotationModel/vehicleQuotationTable";
import { VehicleQuotationType } from "../../../types/vehicleQuotationType";
import { clientType } from "../../../types/clientTypes";
import mongoose from "mongoose";
import { vehicleQuotationTableType } from "../../../types/vehicleQuotationTableTypes";

export const newQuotation = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      // client details
      clientName,
      companyName,
      email,
      phone,
      address,

      //  quotation details
      quotationNumber,
      date,
      totalAmount,
      status,
      termsAndConditions,
      createdBy,

      //   quotation table

      vehicleType,
      brandModel,
      noOfDays,
      ratePerDay,
      total,
      inclusions = [],
      exclusions = [],
    } = req.body;

    if (
      !clientName ||
      !email ||
      !phone ||
      !address ||
      !quotationNumber ||
      !status ||
      !date ||
      totalAmount === null ||
      totalAmount === undefined ||
      !termsAndConditions ||
      !createdBy ||
      !vehicleType ||
      !brandModel ||
      !noOfDays ||
      !ratePerDay ||
      !total
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    // client entry
    let clientData: clientType;
    const checkClientExists = await ClientsModel.findOne({
      email: email,
    })
      .session(session)
      .lean<clientType>();
    if (checkClientExists) {
      clientData = checkClientExists;
    } else {
      const newClient = await ClientsModel.create(
        [
          {
            clientName,
            companyName,
            email,
            phone,
            address,
          },
        ],
        { session }
      );
      if (!newClient) {
        return res.status(500).json({ message: "Failed to create new client" });
      }
      clientData = newClient[0].toObject<clientType>();
    }

    // quotation entry
    const [createQuotation] = await VehicleQuotationModel.create(
      [
        {
          quotationNumber,
          date,
          clientId: clientData._id,
          clientName: clientData.clientName,
          companyName: clientData.companyName || null,
          address: clientData.address,
          contactNumber: clientData.phone,
          email: clientData.email,
          totalAmount,
          status,
          termsAndConditions,
          createdBy,
        },
      ],
      { session }
    );

    // quotation table entry
    const [newQuotationTable] = await VehicleQuotationTableModel.create(
      [
        {
          quotationId: createQuotation._id,
          vehicleType,
          brandModel,
          noOfDays,
          ratePerDay,
          total,
          inclusions,
          exclusions,
        },
      ],
      { session }
    );

    const createQuotationObj = createQuotation.toObject<VehicleQuotationType>();
    const newQuotationTableObj =
      newQuotationTable.toObject<vehicleQuotationTableType>();

    await session.commitTransaction();

    return res.status(201).json({
      message: "New quotation created successfully",
      createQuotation: createQuotationObj,
      newQuotationTable: newQuotationTableObj,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};
