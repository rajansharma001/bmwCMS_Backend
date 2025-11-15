import { Request, Response } from "express";
import { clientType } from "../../types/clientTypes";
import { ClientsModel } from "../../model/quotationModel/clientsModel";

export const updateClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({ error: "Client Id not found." });
    }

    console.log("Running 1");

    const { clientName, companyName, phone, mobile, address } = req.body;
    console.log("Running 2");

    const getExistingClient = await ClientsModel.findById(clientId);
    console.log("Running 3");

    if (!getExistingClient) {
      return res.status(409).json({ error: "Client does not exsist. " });
    }

    const updatedClient = await ClientsModel.findByIdAndUpdate(clientId, {
      clientName: clientName || getExistingClient.clientName,
      companyName: companyName || getExistingClient.companyName,
      phone: phone || getExistingClient.phone,
      mobile: mobile || getExistingClient.mobile,
      address: address || getExistingClient.address,
    });

    console.log("Running 4");

    return res.status(200).json({
      success: "Client updated successfully.",
      updatedClient: updatedClient,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
