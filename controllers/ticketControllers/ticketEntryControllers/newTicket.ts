import { Request, Response } from "express";
import mongoose from "mongoose";
import { TicketBooking } from "../../../types/ticketBookingTypes";
import { clientType } from "../../../types/clientTypes";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
import { TicketBookingModel } from "../../../model/ticketModel/ticketBookingModel";

export const newTicket = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      clientId,
      clientName,
      companyName,
      email,
      phone,
      mobile,
      address,
      bookingDate,
      status,
      tripType,
      departureFrom,
      destinationTo,
      departureDate,
      returnDate,
      airlineName,
      flightNumber,
      seatClass,
      noOfPassengers,
      baseFare,
      taxesAndFees,
      totalAmount,
      currency,
      paymentMethod,
      paymentStatus,
      transactionId,
      bookedBy,
      issuedTicketNumber,
      remarks,
    } = req.body;

    if (!email) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Please provide Email to perform this task.",
      });
    }

    if (
      !bookingDate ||
      !status ||
      !tripType ||
      !departureFrom ||
      !destinationTo ||
      !departureDate ||
      (tripType === "round-trip" && !returnDate) ||
      !airlineName ||
      !flightNumber ||
      !seatClass ||
      !noOfPassengers ||
      !baseFare ||
      !taxesAndFees ||
      !totalAmount ||
      !currency ||
      !paymentMethod ||
      !paymentStatus ||
      !transactionId ||
      !bookedBy ||
      !issuedTicketNumber
    ) {
      session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    let clientData: clientType;

    const checkClientExists = await ClientsModel.findOne({
      email: email,
    })
      .lean<clientType>()
      .session(session);

    if (checkClientExists) {
      clientData = checkClientExists;

      if (clientId && checkClientExists._id.toString() !== clientId) {
        console.warn(
          `Provided clientId ${clientId} does not match existing client ID ${checkClientExists._id} for email ${email}. Using existing client.`
        );
      }
    } else {
      if (!clientName || !phone || !address) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message:
            "Missing required fields for new client registration (Name, Phone, Address).",
        });
      }
      const newClient = await ClientsModel.create(
        [
          {
            clientName,
            companyName,
            email,
            phone,
            mobile,
            address,
          },
        ],
        { session }
      );

      if (!newClient || newClient.length === 0) {
        return res.status(500).json({
          message: "Failed to create new client during ticket booking.",
        });
      }
      clientData = newClient[0].toObject<clientType>();
    }
    const [newTicketBooking] = await TicketBookingModel.create(
      [
        {
          clientId: clientData._id,
          bookingDate,
          status,
          tripType,
          departureFrom,
          destinationTo,
          departureDate,
          returnDate,
          airlineName,
          flightNumber,
          seatClass,
          noOfPassengers,
          baseFare,
          taxesAndFees,
          totalAmount,
          currency,
          paymentMethod,
          paymentStatus,
          transactionId,
          bookedBy,
          issuedTicketNumber,
          remarks,
        },
      ],
      { session }
    );

    const newTicketBookingObj = newTicketBooking.toObject<TicketBooking>();

    await session.commitTransaction();
    return res.status(201).json({
      message: "New booking created successfully.",
      newTicketBookingObj,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: "Internal server error!" });
  } finally {
    session.endSession();
  }
};
