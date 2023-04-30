import { checkSchema, validationResult } from "express-validator";
import { existsSync, unlinkSync } from "fs";

const aboutSchema = checkSchema({
  firstName: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "First name is required",
    },
  },

  lastName: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Last name is required",
    },
  },

  country: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Country is required",
    },
  },

  userType: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "User type is required",
    },
    isIn: {
      options: [["mentor", "mentee"]],
      errorMessage: "Invalid mentorshipLevel",
    },
  },

  languages: {
    isEmpty: {
      negated: true,
      errorMessage: "Languages is required",
    },
  },

  age: {
    isEmpty: {
      negated: true,
      errorMessage: " Age is required",
    },
  },

  mentorshipFor: {
    isEmpty: {
      negated: true,
      errorMessage: " Mentorship for is required",
    },
  },

  provideMentorship: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: " Provide mentorship is required",
    },
  },

  mentorshipLevel: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "MentorshipLevel is required",
    },
    isIn: {
      options: [["A1", "A2", "B1", "B2"]],
      errorMessage: "Invalid mentorshipLevel",
    },
  },

  mentorExperience: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Mentor Experience is required",
    },
  },

  mentorSituation: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Mentor situation is required",
    },
  },
});

const profileImgSchema = checkSchema({
  profileImg: {
    escape: true,
    trim: true,
    custom: {
      escape: true,
      trim: true,
      options: (_, { req }) => {
        if (!req.body.images[0].name === "profileImg") {
          return Promise.reject("profileImg is required!");
        }
        return Promise.resolve();
      },
    },
  },
});

const educationSchema = checkSchema({
  name: {
    isLength: { max: 20 },
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "University name is required",
    },
  },
  degree: {
    isLength: { max: 100 },
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "University degree is required",
    },
  },
  degreeType: {
    isEmpty: {
      negated: true,
      errorMessage: "University degreeType is required",
    },
    isIn: {
      options: [
        [
          "Associate Degree",
          "Bachelor Degree",
          "Master Degree",
          "Post-Doctorate",
          "Professional Degree",
        ],
      ],
      errorMessage: "Invalid University degreeType",
    },
  },
  specialization: {
    isLength: { max: 50 },
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "University specialization is required",
    },
  },
  completedDegree: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "University completeDegree is required",
    },
    isDate: {
      negated: true,
      errorMessage: "University completeDegree is not a date",
    },
  },
  statusDegree: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "University statusDegree is required",
    },
  },
  localProof: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "University localProof is required",
    },
  },

  diploma: {
    trim: true,
    escape: true,
    // options: (_, { req }) => {
    //   if (!req.body.images[0].name === "diploma") {
    //     return Promise.reject("diploma is required!");
    //   }
    //   return Promise.resolve();
    // },
  },

  citizenship: {
    trim: true,
    escape: true,
  },
});

const descriptionSchema = checkSchema({
  headline: {
    isLength: { max: 100 },
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: " Headline is required",
    },
  },

  introduction: {
    isLength: { max: 100 },
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: " introduction is required",
    },
  },

  workExperience: {
    isLength: { max: 100 },
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: " workExperience is required",
    },
  },

  mentorshipProgram: {
    isLength: { max: 100 },
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: " mentorshipProgram is required",
    },
  },
});

const videoLinkSchema = checkSchema({
  videoLink: {
    escape: true,
    trim: true,
    custom: {
      escape: true,
      trim: true,
      options: (_, { req }) => {
        console.log(req?.file && req.body.videoLink === "");
        if (req?.file && req.body.videoLink !== "") {
          return Promise.reject(
            "Please select only a video file or video link."
          );
        } else if (req?.file && req.body.videoLink === "") {
          return Promise.resolve();
        } else if (!req?.file && req.body.videoLink !== "") {
          return Promise.resolve();
        } else {
          return Promise.reject("Please provide a video file or video link.");
        }
      },
    },
  },
});

const availabilitySchema = checkSchema({
  availability: {
    isEmpty: {
      negated: true,
      errorMessage: "availability is required",
    },
  },

  timeZone: {
    escape: true,
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Time zone is required",
    },
  },
});

const pricingSchema = checkSchema({
  hourlyRate: {
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: "hourly price is required",
    },
  },

  serviceFee: {
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: "services fee is required",
    },
  },

  discount: {
    escape: true,
  },
  totalPayment: {
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: "total is required",
    },
  },
});

const mentorStatusSchema = checkSchema({
  status: {
    isEmpty: {
      negated: true,
      errorMessage: "status is required",
    },
  },
});

const errorHandler = (req, res, next) => {
  // handling validation errors
  const validationErrs = validationResult(req);
  if (!validationErrs.isEmpty()) {
    // removing uploaded files
    if (req.hasOwnProperty("file") && existsSync(req.file.path)) {
      unlinkSync(req.file.path);
    }
    return res.status(400).json({ errors: validationErrs.array() });
  }
  next();
};

export default {
  availability: [availabilitySchema, errorHandler],
  description: [descriptionSchema, errorHandler],
  education: [educationSchema, errorHandler],
  profileImg: [profileImgSchema, errorHandler],
  video: [videoLinkSchema, errorHandler],
  pricing: [pricingSchema, errorHandler],
  about: [aboutSchema, errorHandler],
  mentorStatus: [mentorStatusSchema, errorHandler],
};
