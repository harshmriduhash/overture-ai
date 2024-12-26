import emailjs from "@emailjs/browser";

interface SendMessageProps {
  fullname: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendMessage({
  fullname,
  email,
  subject,
  message,
}: SendMessageProps) {
  emailjs.init({
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
  });

  const templateParams = {
    from_name: fullname,
    from_email: email,
    from_subject: subject,
    from_message: message,
  };

  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}
