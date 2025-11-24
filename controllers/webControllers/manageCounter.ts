import { Request, Response } from "express";
import { CounterModel } from "../../model/webModel/counterModel";

export const newCounter = async (req: Request, res: Response) => {
  try {
    console.log("Req body: ", req.body);
    const { countNumber, title } = req.body;
    if (!countNumber || !title) {
      return res.status(404).json({ error: "All fields are required." });
    }

    const checkCounter = await CounterModel.find();
    if (checkCounter.length >= 4) {
      return res.status(400).json({ error: "Maximum counter limit reached." });
    }

    await CounterModel.create({
      countNumber,
      title,
    });

    return res.status(201).json({ success: "Counter added successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getCounter = async (req: Request, res: Response) => {
  try {
    const getCounter = await CounterModel.find();
    if (!getCounter) {
      return res.status(404).json({ error: "Counter not found." });
    }
    return res
      .status(201)
      .json({ success: "Counter fetched successfully.", getCounter });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const getCounterById = async (req: Request, res: Response) => {
  try {
    const counterId = req.params.id;
    if (!counterId) {
      return res.status(404).json({ error: "Counter Id is required." });
    }
    const getCounterById = await CounterModel.findById(counterId);
    if (!getCounterById) {
      return res.status(404).json({ error: "Counter not found." });
    }
    return res
      .status(201)
      .json({ success: "Counter fetched successfully.", getCounterById });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const updateCounter = async (req: Request, res: Response) => {
  try {
    const { countNumber, title } = req.body;

    const counterId = req.params.id;
    if (!counterId) {
      return res.status(404).json({ error: "Counter Id is required." });
    }
    const getCounterById = await CounterModel.findById(counterId);
    if (!getCounterById) {
      return res.status(404).json({ error: "Counter not found." });
    }

    await CounterModel.findByIdAndUpdate(counterId, {
      countNumber: countNumber || getCounterById?.countNumber,
      title: title || getCounterById?.title,
    });

    return res.status(200).json({ success: "Counter updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};
