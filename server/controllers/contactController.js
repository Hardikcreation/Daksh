import sendMail from "../utils/sendMail.js";

export const contact = async (req, res) => {
  const { name, email, message } = req.body;
  await sendMail(email, "Contact Message", `${name}: ${message}`);
  res.json({ message: "Message sent successfully!" });
};
