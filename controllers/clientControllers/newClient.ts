import { Request, Response } from "express";
import { clientType } from "../../types/clientTypes";
import { ClientsModel } from "../../model/quotationModel/clientsModel";

export const newClient = async (req: Request, res: Response) => {
  try {
    const { clientName, companyName, email, mobile, phone, address } =
      req.body as clientType;

    if (!clientName || !email || !mobile || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const checkExistingClient = await ClientsModel.find({ email });
    if (checkExistingClient) {
      return res.status(409).json({
        message: `Client with email: ${email} already exsist. Please proceed to perform other task.`,
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
      return res.status(409).json({ message: "New client creation failed." });
    }

    return res
      .status(201)
      .json({ message: "New client created successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};
