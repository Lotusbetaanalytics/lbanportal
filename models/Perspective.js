const mongoose = require("mongoose");

const PerspectiveSchema = new mongoose.Schema({
  financial: {
    type: Object,
    default: {
      objectives: [
        "Revenue target of NGN5B",
        "Deliver 10% of revenue from public sector business",
        "Project profitability – Is = or > 10% of Project cost",
        "Cost effectiveness -  ARCFY22 < or = 95% of ARCFY21  with COL  < & = NGN200M ",
        "Profit margin -  20% Profit Margin",
      ],
    },
  },
  customer: {
    type: Object,
    default: {
      objectives: [
        "Increase customer base by adding 50% new Customers",
        "Customer satisfaction – 90% of our customers should agree to refer us",
        "New customer acquisition  - 50% net new customers of the 72 we currently have",
        "External incentive management – 5% of profit margin on Sales (Direct or Referral) to drive Referral System ",
        "End – to – End Support system – Drive improvement in customer support process and target quarterly",
        "Drive social media presence (Improve on company brand) – Drive Social Media Presence 50%",
      ],
    },
  },
  internal: {
    type: Object,
    default: {
      objectives: [
        "Define end to end at least 2 packaged Services per Q",
        "Billable hours - Every Technical staff should have at least 80% of billable hours ",
        "Internal documentation – Implement a single document portal and have 1 process documented per department per Q",
        "External incentive management – 5% of profit margin on Sales (Direct or Referral) to drive Referral System ",
        "Automation of internal processes – Operationalize 1 internal process per department per Q",
        "Customer Centricity - Drive culture of customer first per Q",
      ],
    },
  },
  innovationlearningandgrowth: {
    type: Object,
    default: {
      objectives: [
        "Ensure that 40% of business is non-Microsoft",
        "Ensure that 20% of business is LBAN own solution",
        "Quarterly training targets defined, tracked and archived",
        "Employee engagement project -  Drive Employee engagement project per Q ",
        "Cultural change project –  Drive cultural change project every quarter.",
        `22.	Reward system –
           1.	The project Team get 15% of project profitability so long it’s = or > 10% profitability.
           2.	The product Team get 15% of product profitability from sale so long it’s = or > 10% profitability.
`,
        "Innovation of Products – Drive the innovation of 2 solution per year",
        "Improvement on current products – Drive improvement in at least 4 products per year",
      ],
    },
  },
  scores: {
    type: Object,
    default: {
      financial: { type: Number, default: 0, max: 25 / 100 },
      customer: { type: Number, default: 0, max: 25 / 100 },
      internal: { type: Number, default: 0, max: 25 / 100 },
      innovationlearningandgrowth: { type: Number, default: 0, max: 25 / 100 },
    },
  },
  totalScore: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Perspective", PerspectiveSchema);
