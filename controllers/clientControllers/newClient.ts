import { Request, Response } from "express";
import { clientType } from "../../types/clientTypes";
import { ClientsModel } from "../../model/quotationModel/clientsModel";

export const newClient = async (req: Request, res: Response) => {
  try {
    const { clientName, companyName, email, mobile, phone, address } =
      req.body as clientType;

    if (!clientName || !email || !mobile || !address) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const checkExistingClient = await ClientsModel.findOne({ email });
    if (checkExistingClient) {
      return res.status(409).json({
        error: `Client with email: ${email} already exsist. Please proceed to perform other task.`,
      });
    }

    const newClient = await ClientsModel.create({
      clientName,
      companyName,
      email,
      phone,
      mobile,
      address,
    });

    if (!newClient) {
      return res.status(409).json({ error: "New client creation failed." });
    }

    return res
      .status(201)
      .json({ success: "New client created successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};
