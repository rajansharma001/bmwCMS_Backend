import { Request, Response } from "express";
import { VehicleQuotationModel } from "../../../model/quotationModel/vehicleQuotationModel";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
import { VehicleQuotationTableModel } from "../../../model/quotationModel/vehicleQuotationTable";
import { VehicleQuotationType } from "../../../types/vehicleQuotationType";
import { vehicleQuotationTableType } from "../../../types/vehicleQuotationTableTypes";
import mongoose from "mongoose";

export const editQuotation = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      quotationNumber,
      date,
      totalAmount,
      status,
      termsAndConditions,
      createdBy,
      clientId,
      vehicleType,
      brandModel,
      noOfDays,
      ratePerDay,
      total,
      inclusions = [],
      exclusions = [],
    } = req.body;

    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({ message: "Quotation ID is required" });
    }

    const checkQuotation = await VehicleQuotationModel.findById(_id).session(
      session
    );
    if (!checkQuotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (checkQuotation.status !== "accepted" || "sent") {
      return res
        .status(409)
        .json({ message: "You can not delete a processed quotation." });
    }

    const getClient = await ClientsModel.findOne({
      _id: clientId,
    }).session(session);

    if (!getClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const updatedQuotation = await VehicleQuotationModel.findByIdAndUpdate(
      _id,
      {
        quotationNumber: quotationNumber || checkQuotation.quotationNumber,
        date: date || checkQuotation.date,
        totalAmount: totalAmount || checkQuotation.totalAmount,
        status: status || checkQuotation.status,
        termsAndConditions:
          termsAndConditions || checkQuotation.termsAndConditions,
        createdBy: createdBy || checkQuotation.createdBy,
        clientName: getClient.clientName,
        companyName: getClient.companyName,
        address: getClient.address,
        contactNumber: getClient.phone,
        email: getClient.email,
      },

      { new: true, session }
    );

    const getQuotationTable = await VehicleQuotationTableModel.findOne({
      quotationId: _id,
    }).session(session);
    if (!getQuotationTable) {
      return res.status(404).json({ message: "Quotation table not found" });
    }

    const updatedQuotationTable =
      await VehicleQuotationTableModel.findOneAndUpdate(
        {
          quotationId: _id,
        },
        {
          vehicleType: vehicleType ?? getQuotationTable.vehicleType,
          brandModel: brandModel ?? getQuotationTable.brandModel,
          noOfDays: noOfDays ?? getQuotationTable.noOfDays,
          ratePerDay: ratePerDay ?? getQuotationTable.ratePerDay,
          total: total ?? getQuotationTable.total,
          inclusions: inclusions ?? getQuotationTable.inclusions,
          exclusions: exclusions ?? getQuotationTable.exclusions,
        },
        { new: true, session }
      );

    const updatedQuotationObj =
      updatedQuotation?.toObject<VehicleQuotationType>();
    const updatedQuotationTableObj =
      updatedQuotationTable?.toObject<vehicleQuotationTableType>();

    await session.commitTransaction();

    return res.status(200).json({
      message: "Quotation updated successfully",
      updatedQuotation: updatedQuotationObj,
      updatedQuotationTable: updatedQuotationTableObj,
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};
