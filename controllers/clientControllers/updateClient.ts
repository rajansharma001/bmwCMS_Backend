import { Request, Response } from "express";
import { clientType } from "../../types/clientTypes";
import { ClientsModel } from "../../model/quotationModel/clientsModel";

export const updateClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({ message: "Client Id not found." });
    }
    const { clientName, companyName, email, phone, mobile, address } =
      req.body as clientType;

    const getExistingClient = await ClientsModel.findById(clientId);
    if (!getExistingClient) {
      return res.status(409).json({ message: "Client does not exsist. " });
    }
    const updatedClient = await ClientsModel.findByIdAndUpdate(clientId, {
      clientName: clientName || getExistingClient.clientName,
      companyName: companyName || getExistingClient.companyName,
      email: email || getExistingClient.email,
      phone: phone || getExistingClient.phone,
      mobile: mobile || getExistingClient.mobile,
      address: address || getExistingClient.address,
    });

    return res.status(200).json({
      message: "Client updated successfully.",
      updatedClient: updatedClient,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
