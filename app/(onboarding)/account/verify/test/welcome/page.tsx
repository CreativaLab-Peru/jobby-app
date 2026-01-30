// import {inngest} from "@/inngest/functions/client";

export default async function SendTestPage() {
  const user = {
    // Uuid v4 random
    id: "RPlh4Sg3S6aWmol9OhDn49JKlBWD7LLa",
    email: "edward.melendez.mendigure@gmail.com",
    name: "Edward Melendez",
  }
  // const codeSixDigits = "123456";
  // await inngest.send({
  //   name: "send/welcome",
  //   data: {
  //     email: user.email,
  //     name: user.name,
  //     userId: user.id,
  //   }
  // });

  // await inngest.send({
  //   name: "send.verification.code",
  //   data: {
  //     email: user.email, // Asegúrate que 'data.email' venga en el body
  //     name: user.name,
  //     codeSixDigits,
  //   }
  // });



  return (
    <div>
      <h1>Send Test Email</h1>
      <p>This is the Send Test Email page.</p>
    </div>
  );
}
