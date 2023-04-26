import User from "../models/User.js"
import sendMail from "../utils/sendMail.js"
import OtpVerificationTemplate from "../views/verification-otp.js"
import schedule from "node-schedule"

const cornJobs = async () => {
	const jobs = schedule.scheduleJob(process.env.SCHEDULER, async () => {
		const users = await User.find({ isCompleted: false, $ne: { pages: 7 } })

		// Send mails to users
		if (users.length > 0) {
			users.forEach((user) => {
				const message = `You have not completed the sign up from please complete it from step <a target='_blank'>http://localhost:3000/user/complete-profile?step=${user.pages}</a>`
				const emailContent = new OtpVerificationTemplate(
					user?.pages,
					message,
					user.email,
				)

				return sendMail({
					email: user.email,
					subject: ` incomplete steps `,
					html: emailContent.render(),
				})
			})
		}

		jobs.cancel()
	})
}

export { cornJobs }
