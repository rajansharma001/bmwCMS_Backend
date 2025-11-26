import { Request, Response } from "express";
import { ClientsModel } from "../../model/quotationModel/clientsModel";

export const getClients = async (req: Request, res: Response) => {
  try {
    const getClients = await ClientsModel.find();
    if (getClients.length <= 0) {
      return res.status(404).json({ error: "Clients not found." });
    }

    return res
      .status(200)
      .json({ error: "Client fetched successfully.", getClients });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getClientsById = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({ error: "Client Id is required" });
    }
    const getClientsById = await ClientsModel.findById({ _id });
    if (!getClientsById) {
      return res.status(404).json({ error: "Client not found." });
    }

    return res
      .status(200)
      .json({ success: "Client fetched successfully.", getClientsById });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};
