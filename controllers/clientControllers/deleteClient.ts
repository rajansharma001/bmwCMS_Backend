import { Request, Response } from "express";
import { ClientsModel } from "../../model/quotationModel/clientsModel";
import { VehicleQuotationModel } from "../../model/quotationModel/vehicleQuotationModel";

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({ message: "Client Id not found." });
    }

    const getExistingClient = await ClientsModel.findById(clientId);
    if (!getExistingClient) {
      return res.status(404).json({ message: "Client does not exist." });
    }

    const checkClientWithQuotation = await VehicleQuotationModel.findOne({
      clientId,
    });

    if (checkClientWithQuotation) {
      return res.status(400).json({
        message:
          "Client associates with an Quotation. You can not delete this client.",
      });
    }

    await ClientsModel.findByIdAndDelete(clientId);
    return res.status(200).json({ message: "Client deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};
