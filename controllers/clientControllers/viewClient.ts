import { Request, Response } from "express";
import { ClientsModel } from "../../model/quotationModel/clientsModel";

export const viewClients = async (req: Request, res: Response) => {
  try {
    const getClients = await ClientsModel.find();
    if (getClients.length <= 0) {
      return res.status(404).json({ message: "Clients not found." });
    }

    return res
      .status(200)
      .json({ message: "Client fetched successfully.", getClients });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};
