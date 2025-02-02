// import the resend library for sending emails
import { Resend } from "resend";

// Import the dotenv library to lead environment variables form a .env file
import dotenv from "dotenv";
import { Subject } from "@mui/icons-material";
//import { error } from "laravel-mix/src/Log";

// Load environment variables from the .env file into process file
dotenv.config("../../.env");

// check if the resend api enviroment variable is set
// if it is not provided of not path is corrected terminate programe
if (!process.env.RESEND_API) {
  console.log("Provide RESEND_API inside the .env file");
}

// Create a new instance of the Resend class using the API key from the environment variable.
// This instance will be used to send emails.
const resend = new Resend(process.env.RESEND_API);

// Define an asynchronous function named `sendEmail` to send an email.
// It takes an object as an argument, which contains:
// - `sendTo`: Recipient's email address
// - `subject`: Subject of the email
// - `html`: The HTML content of the email

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Binkeyit <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });

    // Check if there's an error returned by the Resend library.
    // If an error exists, log it to the console and terminate further processing.
    if (error) {
      return console.error({ error });
    }

    // IF the email was sent sucessfully , return the response data
    return data;
  } catch {
    // If an exception occurs during the process, catch it and log the error.
    console.log(error);
  }
};
// Export the `sendEmail` function as the default export from this module.
// This allows other files to import and use the `sendEmail` function.
export default sendEmail;
