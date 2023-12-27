import { Request, Response } from "express";
import db from "../models";
import { manualbookingService, invoiceService } from "../services";
import { BOOKED_BY, BOOKING_STATUS, PAYMENT_TYPES } from "../utils/constants";
const mediaInput = require("../middlewares/mediaInput");
const { QueryTypes } = require("sequelize");

const fs = require("fs");
const pdf = require("pdf-creator-node");
const path = require("path");
const ejs = require("ejs");

const data = require("../utils/data");

const ManualBooking = db.manual_booking;

// const ejs = require('ejs');
// const fs = require('fs');

// Create and Save a new blog
export const create = async (req: any, res: Response): Promise<void> => {
  try {
    // Validate request

    if (!req.body) {
      console.log("Flailed");
      res.status(400).send({ message: "Content missing in body!" });
      return;
    }
    if (!req.body.booking_status) {
      req.body.booking_status = BOOKING_STATUS.CONFIRMED;
    }
    if (req.body.payment_mode) {
      req.body.payment_mode = Number(req.body.payment_mode);
    }
    console.log("REQUESt body", req.body);
    // Save blog in the database
    // const data = await ManualBooking.create(req.body);
    const data = await manualbookingService.createManualBooking(req.body);
    res.send(data);
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the product.",
    });
  }
};

export const findAll = async (req: Request, res: Response): Promise<void> => {
  console.log("hit");
  try {
    // You can uncomment and use the following lines if you want to filter by 'content'
    // const content = req.query.content;
    // const condition = content ? { state_name: content } : null;

    // Instead of using a separate variable for 'condition', you can directly pass it to the query
    const data = await db.sequelize.query(
      `SELECT
        mb.*,
        COALESCE(st.name, '') AS staff_name,
        COALESCE(sc.subcategory, '') AS subcategory,
        COALESCE(cat.category , '')  AS category
      FROM
        manualbooking AS mb
      LEFT JOIN
        staff_details AS st ON mb.staff_id = st.id
      LEFT JOIN
        subcategories AS sc ON mb.sub_category_id = sc.id
      LEFT JOIN
        categories AS cat ON mb.category_id = cat.id;
    `,
      {
        // If needed, you can use replacements to replace parameters in your query
        // replacements: { status: "active" },
        type: QueryTypes.SELECT,
      }
    );

    console.log("Data from booking", data);
    res.send(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving data.",
    });
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    console.log("Bokkig id", id);

    const rowsDeleted = await ManualBooking.destroy({
      where: { id: id },
    });

    if (rowsDeleted === 0) {
      res.status(404).send({
        message: `Cannot delete Booking with id=${id}. Maybe Booking was not found!`,
      });
    } else {
      res.send({
        message: "Booking was deleted successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Tutorial with ",
    });
  }
};

export const findByPaymentId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const paymentId = decodeURIComponent(req.params.id);
    console.log("PAyment id ", req.params.id);
    const data = await manualbookingService.getManualBookingByPaymentId(
      req.params.id
    );
    if (!data) {
      res.status(404).send({ message: "Not found blooking with id " });
    } else {
      res.send(data);
    }
  } catch (err) {
    res.status(500).send({ message: "Error retrieving blooking with id=" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    console.log("Updation body", req.body);

    const [rowsUpdated] = await ManualBooking.update(req.body, {
      where: { id: id },
    });

    if (rowsUpdated === 0) {
      res.status(404).send({
        message: `Cannot update ManualBooking with id=${id}. Maybe ManualBooking was not found!`,
      });
    } else {
      res.send({ message: "ManualBooking was updated successfully." });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating ManualBooking with id=",
    });
  }
};

export const deleteManualBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    console.log("Bokkig id", id);

    const rowsDeleted = await ManualBooking.destroy({
      where: { id: id },
    });

    if (rowsDeleted === 0) {
      res.status(404).send({
        message: `Cannot delete ManualBooking with id=${id}. Maybe ManualBooking was not found!`,
      });
    } else {
      res.send({
        message: "ManualBooking was deleted successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete Tutorial with ",
    });
  }
};

export const deleteAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const rowsDeleted = await ManualBooking.destroy({
      where: {},
      truncate: false,
    });

    res.send({
      message: `${rowsDeleted} ManualBookings were deleted successfully!`,
    });
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all blogs.",
    });
  }
};

export const generateTestPdf = async (req: any, res: any): Promise<void> => {
  const html = fs.readFileSync(
    path.join(__dirname, "../views/invoice-template.html"),
    "utf-8"
  );
  console.log("HItted");

  let data = {
    id: 1,
    name: "Ankit",
    city: "Ankit",
    mobile_number: "Ankit",
    country: "Ankit",
    title: "Ankit",
    quantity: "Ankit",
    total_amount: "Ankit",
    deposit_amount: "Ankit",
    pending_amount: "Ankit",
    start_date: "Ankit",
    booking_date: "Ankit",
  };

  const document = {
    html: html,
    data: data,
    // path: "./docs/" + filename,
    type: "buffer",
  };
  // let pdfResponse = await pdf.create(document, options);
  // console.log("PDf response", pdfResponse);
  // let response = await mediaInput.uploadInvoice(pdfResponse);

  // if (!response.uploaded) {
  //   res.status(500).send({
  //     message: "File Could not get uploaded please try again later!",
  //   });
  // }

  // const filepath = "http://localhost:3000/docs/" + filename;

  // res.render('download', {
  //     path: filepath
  // });
  console.log("INvoice service", invoiceService);
  let response = await invoiceService.testPdf(data, html);
  // res.send({ link: response.url });
  res.send({ response });
};

const testPdf = async (bookingInfo: any, html: any) => {
  const document = {
    html: html,
    data: bookingInfo,
    // path: "./docs/" + filename,
    type: "buffer",
  };
  console.log("Response", pdf);
  console.log("Doucment", document);
  const options = {
    formate: "A4",
    orientation: "portrait",
    border: "2mm",
    timeout: "100000",
  };
  console.log("OPtions", options);
  let pdfResponse = await pdf.create(document, options);
  console.log("PDf response", pdfResponse);
  let response = await mediaInput.uploadInvoice(pdfResponse);

  if (!response.uploaded) {
    return 0;
  }
  return response;
};

export const renderInvoice = async (req: any, res: any) => {
  let bookingInfo = await manualbookingService.getManualBookingByPaymentId(
    req.params.paymentId
  );
  // bookingInfo = bookingInfo.toJSON();
  console.log("ManualBooking info received", bookingInfo);
  let response: any = await db.sequelize.query(
    `SELECT
  products.title,
  bookings.id,
  bookings.quantity,
  bookings.total_amount,
  bookings.deposit_amount,
  bookings.pending_amount,
  bookings.start_date,
  bookings.booking_date,
  customers.name,
  customers.mobile_number,
  customers.city,
  customers.country
FROM
  bookings
JOIN
  products ON bookings.product_id = products.id
JOIN
  customers ON bookings.customer_id = customers.id
WHERE
  products.id = ${bookingInfo.product_id}
  AND bookings.id = ${bookingInfo.id}
  AND customers.id = ${bookingInfo.customer_id};
`,
    {
      // replacements: { status: "active" },
      type: QueryTypes.SELECT,
    }
  );
  console.log("Response from raw sql query", response[0]);

  res.render("invoice-template", response[0]);
};
