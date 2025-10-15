const mongoose = require('mongoose');

// --- SUB-SCHEMAS FOR VARIOUS DEPARTMENT PAGES ---
const navTabSchema = new mongoose.Schema({ name: String, path: String }, { _id: false });

const departmentDetailSchema = new mongoose.Schema({ label: String, value: String, type: String }, { _id: false });
const profileDataSchema = new mongoose.Schema({
    overview: String,
    departmentDetails: [departmentDetailSchema],
    hod: { name: String, title: String, email: String, image: String }
}, { _id: false });

const visionMissionDataSchema = new mongoose.Schema({
    vision: String,
    mission: [String],
    peos: [String],
    psos: [String],
    pos: [String]
}, { _id: false });

const courseSchema = new mongoose.Schema({ srNo: String, name: String, startYear: String, duration: String, type: String, intake: String }, { _id: false });
const committeeMemberSchema = new mongoose.Schema({ srNo: String, name: String, designation: String, status: String }, { _id: false });
const outcomeLinkSchema = new mongoose.Schema({ text: String, href: String }, { _id: false });
const programmesDataSchema = new mongoose.Schema({
    courses: [courseSchema],
    pacMembers: [committeeMemberSchema],
    dabMembers: [committeeMemberSchema],
    courseOutcomesLinks: [outcomeLinkSchema]
}, { _id: false });

const facultyMemberSchema = new mongoose.Schema({
    id: String,
    img: String,
    name: String,
    designation: String,
    specialization: String,
    email: String
}, { _id: false });
const facultyDataSchema = new mongoose.Schema({
    teachingStaff: [facultyMemberSchema],
    supportingStaff: [facultyMemberSchema]
}, { _id: false });

const labSchema = new mongoose.Schema({
    srNo: Number,
    id: String,
    name: String,
    area: String,
    incharge: String
}, { _id: false });

const activitySchema = new mongoose.Schema({ img: String, text: String, pdf: String }, { _id: false });
const webinarSchema = new mongoose.Schema({
    title: String,
    introduction: String,
    paragraphs: [String],
    images: [String]
}, { _id: false });
const activitiesDataSchema = new mongoose.Schema({
    reports: [activitySchema],
    webinar: webinarSchema
}, { _id: false });

const cucBoardMemberSchema = new mongoose.Schema({ id: Number, name: String, post: String, class: String }, { _id: false });
const cucEventSchema = new mongoose.Schema({ id: Number, name: String, date: String, link: String, status: String }, { _id: false });
const cucDataSchema = new mongoose.Schema({
    introduction: [String],
    boards: [{ year: String, members: [cucBoardMemberSchema] }],
    events: [{ year: String, eventList: [cucEventSchema] }]
}, { _id: false });

const csiIeiPdfSchema = new mongoose.Schema({ img: String, text: String, pdf: String }, { _id: false });
const csiIeiWorkshopSchema = new mongoose.Schema({
    title: String,
    introduction: String,
    welcomeImage: String,
    welcomeCaption: String,
    mainParagraph: String,
    organizers: String,
    glimpseImages: [String],
    glimpseCaption: String
}, { _id: false });
const blindCSchema = new mongoose.Schema({
    introduction: String,
    image: String,
    imageCaption: String,
    winner: String,
    runnerUp: String
}, { _id: false });
const csiIeiDataSchema = new mongoose.Schema({
    reports: [csiIeiPdfSchema],
    iotWorkshop: csiIeiWorkshopSchema,
    blindC: blindCSchema,
    pythonWorkshop: {
        introduction: String,
        image: String,
        imageCaption: String
    }
}, { _id: false });

const achievementsDataSchema = new mongoose.Schema({ images: [String] }, { _id: false });

const placementSectionSchema = new mongoose.Schema({
    introduction: String,
    detailsPdf: String,
    recruitersImage: String,
    glanceImages: [String]
}, { _id: false });
const pdfSectionSchema = new mongoose.Schema({ pdfUrl: String }, { _id: false });
const visitReportSchema = new mongoose.Schema({ title: String, pdfUrl: String }, { _id: false });
const trainingPlacementDataSchema = new mongoose.Schema({
    placements: placementSectionSchema,
    internship: pdfSectionSchema,
    training: pdfSectionSchema,
    industrialVisits: [visitReportSchema]
}, { _id: false });

// --- MAIN DEPARTMENT SCHEMA ---
const departmentContentSchema = new mongoose.Schema({
    departmentIdentifier: { type: String, required: true, unique: true },
    departmentName: { type: String, required: true },
    departmentTabs: [navTabSchema],
    profileData: profileDataSchema,
    visionMissionData: visionMissionDataSchema,
    programmesData: programmesDataSchema,
    facultyData: facultyDataSchema,
    laboratories: [labSchema],
    activitiesData: activitiesDataSchema,
    cucData: cucDataSchema,
    csiIeiData: csiIeiDataSchema,
    achievementsData: achievementsDataSchema,
    trainingPlacementData: trainingPlacementDataSchema,
    curriculumData: {
        syllabus: [{ yearSection: String, files: [{ srNo: Number, heading: String, link: String }] }]
    },
    researchData: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('DepartmentContent', departmentContentSchema);