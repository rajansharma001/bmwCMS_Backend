import { Request, Response } from "express";
import { TripModel } from "../../../model/tripModel";
import { Vehicle } from "../../../model/vehicleModel";
import { ClientsModel } from "../../../model/quotationModel/clientsModel";
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const {
      vehicleId,
      clientId,
      startLocation,
      endLocation,
      avgKM,
      ratePerDay,
      noOfDays,
      startKM,
      endKM,
      terms,
    } = req.body;

    console.log("Req body from frontend: ", req.body.formData);

    // Recalculate total amount on the server
    const totalAmount = Number(ratePerDay) * Number(noOfDays);

    const checkTrip = await TripModel.findById(_id);
    if (!checkTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (totalAmount < checkTrip.totalPaidAmount) {
      return res.status(400).json({
        error: `New total (${totalAmount}) cannot be less than already paid amount (${checkTrip.totalPaidAmount}).`,
      });
    }

    const checkVehicleExsist = await Vehicle.findById(vehicleId);
    if (!checkVehicleExsist) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    const checkClientExsist = await ClientsModel.findById(clientId);
    if (!checkClientExsist) {
      return res.status(404).json({ error: "Client not found." });
    }

    const updatedTrip = await TripModel.findByIdAndUpdate(
      _id,
      {
        vehicleId,
        clientId,
        startLocation,
        endLocation,
        avgKM: Number(avgKM),
        ratePerDay: Number(ratePerDay),
        noOfDays: Number(noOfDays),
        totalAmount: totalAmount,
        startKM: Number(startKM),
        endKM: Number(endKM),
        terms,
      },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip updation failed." });
    }

    return res
      .status(200)
      .json({ success: "Trip updated successfully", updatedTrip });
  } catch (error: any) {
    console.error("Error updating trip:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
