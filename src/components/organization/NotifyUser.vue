<!-- <template>
  <div class="container">
    <h2>Send Email</h2>
    <form @submit.prevent="sendEmail">
      <input type="text" v-model="userName" placeholder="Your Name" required />
      <input type="email" v-model="userEmail" placeholder="Your Email" required />
      <textarea v-model="message" placeholder="Your Message" required></textarea>
      <button type="submit">Send</button>
    </form>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import emailjs from "emailjs-com";

export default {
  data() {
    return {
      userName: "",
      userEmail: "",
      message: "",
      successMessage: "",
      errorMessage: ""
    };
  },
  methods: {
    sendEmail() {
      const serviceID = "your_service_id";  // حطي ID الخاص بالخدمة اللي سجلتيها
      const templateID = "your_template_id"; // حطي ID الخاص بالتيمبلت
      const publicKey = "your_public_key"; // حطي مفتاح API الخاص بيكِ

      const templateParams = {
        from_name: this.userName,
        from_email: this.userEmail,
        message: this.message
      };

      emailjs.send(serviceID, templateID, templateParams, publicKey)
        .then((response) => {
          console.log("Email sent successfully!", response);
          this.successMessage = "Email sent successfully!";
          this.clearForm();
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          this.errorMessage = "Failed to send email. Please try again.";
        });
    },
    clearForm() {
      this.userName = "";
      this.userEmail = "";
      this.message = "";
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
input, textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
button {
  background-color: teal;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style> -->
<template>
<div class="flex justify-center items-center min-h-screen">
  <div class="w-full lg:w-1/2 xl:w-5/12 lg:me-25 text-center">
    <div class="relative p-8 bg-white rounded-lg shadow-lg dark:bg-dark-2 sm:p-12">
      <form @submit.prevent="sendEmail">
        <div class="mb-6">
          <input
            v-model="OrganizationName"
            type="text"
            placeholder="Organization Name"
            class="border-stroke dark:border-dark-3 dark:text-dark-6 dark:bg-dark text-body-color focus:border-primary w-full rounded border py-3 px-[14px] text-base outline-none"
          />
        </div>
        <div class="mb-6">
          <input
            v-model="name"
            type="text"
            placeholder="User Name"
            class="border-stroke dark:border-dark-3 dark:text-dark-6 dark:bg-dark text-body-color focus:border-primary w-full rounded border py-3 px-[14px] text-base outline-none"
          />
        </div>
        <div class="mb-6">
          <input
            v-model="email"
            type="email"
            placeholder="User Email"
            class="border-stroke dark:border-dark-3 dark:text-dark-6 dark:bg-dark text-body-color focus:border-primary w-full rounded border py-3 px-[14px] text-base outline-none"
          />
        </div>
        <div class="mb-6">
          <input
            v-model="quizcode"
            type="text"
            placeholder="Quiz Code"
            class="border-stroke dark:border-dark-3 dark:text-dark-6 dark:bg-dark text-body-color focus:border-primary w-full rounded border py-3 px-[14px] text-base outline-none"
          />
        </div>
        <div class="mb-6">
          <input
            v-model="message"
            type="text"
            placeholder="Website Link"
            class="border-stroke dark:border-dark-3 dark:text-dark-6 dark:bg-dark text-body-color focus:border-primary w-full rounded border py-3 px-[14px] text-base outline-none"
          ></input>
        </div>
        <div>
          <button
            type="submit"
            class="w-full p-3 text-white transition border rounded border-primary text-tear-900 bg-teal-900 hover:bg-teal-700 cursor-pointer"
          >
            Send Message
          </button>   
        </div>
      </form>             
    </div>
  </div>
</div>


</template>

<script>
import emailjs from "@emailjs/browser";

export default {
data() {
return {
OrganizationName:"",
name: "",
email: "",
quizcode: "",
message: "",
};
},

methods: {
async sendEmail() {
try {
const serviceID = "service_vfqov6e";
const templateID = "template_jple4br";
const publicKey = "wQb6IC1fjIt3_eUVs";

const templateParams = {
  OrganizationName:this.OrganizationName,
 to_name: this.name,
  user_email: this.email,
  quizcode: this.quizcode,
  message: this.message,
};

await emailjs.send(serviceID, templateID, templateParams, publicKey);
alert("Your message has been sent successfully!");
this.OrganizationName="";

this.name = "";
this.email = "";
this.quizcode = "";
this.message = "";
} catch (error) {
  console.error("Error while sending:", error);
  alert("An error occurred while sending your message.");
}
},
},
};
</script>
