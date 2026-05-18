import { beforeEach, describe, expect, it } from "bun:test";
import type { Table, UnifiedGameData } from "../core/types";
import { survey } from "../modes/survey";

describe("SurveyGenerator", () => {
  let generator: typeof survey;

  beforeEach(() => {
    generator = survey;
  });

  const createQuestionsTable = (): Table => ({
    headers: [
      "id",
      "type",
      "content",
      "optionA",
      "optionB",
      "optionC",
      "optionD",
      "answer",
      "score",
      "explanation",
      "category",
    ],
    rows: [
      {
        id: "q1",
        type: "choice",
        content: "世界第一的公主殿下是？",
        optionA: "cona",
        optionB: "miku",
        optionC: "pazu",
        optionD: "lbxx",
        answer: "B",
        score: "10",
        explanation: "初音未来是世界第一的公主殿下",
        category: "动漫",
      },
      {
        id: "q2",
        type: "choice",
        content: "以下哪个是 VOCALOID 软件？",
        optionA: "CeVIO",
        optionB: "UTAU",
        optionC: "VOCALOID",
        optionD: "以上都是",
        answer: "D",
        score: "10",
        explanation: "",
        category: "音乐",
      },
      {
        id: "q3",
        type: "judge",
        content: "太阳从东方升起。",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: "true",
        score: "5",
        explanation: "这是基本的天文知识",
        category: "常识",
      },
      {
        id: "q4",
        type: "judge",
        content: "水的化学式是 H2O。",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: "true",
        score: "5",
        explanation: "",
        category: "科学",
      },
      {
        id: "q5",
        type: "choice",
        content: "1 + 1 = ?",
        optionA: "1",
        optionB: "2",
        optionC: "3",
        optionD: "4",
        answer: "B",
        score: "5",
        explanation: "基础数学",
        category: "数学",
      },
    ],
    lookup: {
      q1: {
        id: "q1",
        type: "choice",
        content: "世界第一的公主殿下是？",
        optionA: "cona",
        optionB: "miku",
        optionC: "pazu",
        optionD: "lbxx",
        answer: "B",
        score: "10",
        explanation: "初音未来是世界第一的公主殿下",
        category: "动漫",
      },
      q2: {
        id: "q2",
        type: "choice",
        content: "以下哪个是 VOCALOID 软件？",
        optionA: "CeVIO",
        optionB: "UTAU",
        optionC: "VOCALOID",
        optionD: "以上都是",
        answer: "D",
        score: "10",
        explanation: "",
        category: "音乐",
      },
      q3: {
        id: "q3",
        type: "judge",
        content: "太阳从东方升起。",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: "true",
        score: "5",
        explanation: "这是基本的天文知识",
        category: "常识",
      },
      q4: {
        id: "q4",
        type: "judge",
        content: "水的化学式是 H2O。",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: "true",
        score: "5",
        explanation: "",
        category: "科学",
      },
      q5: {
        id: "q5",
        type: "choice",
        content: "1 + 1 = ?",
        optionA: "1",
        optionB: "2",
        optionC: "3",
        optionD: "4",
        answer: "B",
        score: "5",
        explanation: "基础数学",
        category: "数学",
      },
    },
  });

  const createResultsTable = (): Table => ({
    headers: ["min", "max", "title", "description"],
    rows: [
      { min: "0", max: "40", title: "继续努力", description: "还需要多多学习呢" },
      { min: "40", max: "80", title: "不错", description: "再接再厉" },
      { min: "80", max: "100", title: "优秀", description: "太棒了！" },
    ],
    lookup: {},
  });

  const createConfigTable = (): Table => ({
    headers: ["key", "value"],
    rows: [
      { key: "title", value: "哔哩哔哩入学考试" },
      { key: "description", value: "来测测你是不是真正的二次元" },
      { key: "maxQuestions", value: "5" },
      { key: "randomize", value: "true" },
      { key: "showAnswer", value: "true" },
      { key: "passScore", value: "60" },
      { key: "isExam", value: "true" },
    ],
    lookup: {},
  });

  const createTestData = (): UnifiedGameData => ({
    tables: {
      questions: createQuestionsTable(),
      results: createResultsTable(),
      config: createConfigTable(),
    },
  });

  describe("metadata", () => {
    it("should have correct id", () => {
      expect(generator.id).toBe("survey");
    });

    it("should have correct name", () => {
      expect(generator.name).toBe("问卷/考试系统");
    });

    it("should have required tables", () => {
      expect(generator.requiredTables).toEqual(["questions"]);
    });
  });

  describe("validate", () => {
    it("should validate correct data", () => {
      const data = createTestData();
      const result = generator.validate(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing questions table", () => {
      const data: UnifiedGameData = { tables: {} };
      const result = generator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.table === "questions")).toBe(true);
    });
  });

  describe("generate", () => {
    it("should generate correct number of files", () => {
      const data = createTestData();
      const result = generator.generate(data);
      expect(result.files).toHaveLength(2);
    });

    it("should generate survey/index.md file", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const fileNames = result.files.map((f) => f.path);
      expect(fileNames).toContain("index.md");
      expect(fileNames).toContain("questions.ink");
    });

    it("should generate valid index.md with frontmatter and survey logic", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("---");
      expect(surveyInk.content).toContain("layout: game");
      expect(surveyInk.content).toContain("display: survey");
      expect(surveyInk.content).toContain("INCLUDE questions.ink");
    });

    it("should include title and description", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("哔哩哔哩入学考试");
      expect(surveyInk.content).toContain("来测测你是不是真正的二次元");
    });

    it("should include exam mode text", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("考试");
      expect(surveyInk.content).not.toContain("问卷");
    });

    it("should include all questions", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const questionsInk = result.files.find((f) => f.path === "questions.ink");
      expect(questionsInk).toBeDefined();
      if (!questionsInk) return;

      expect(questionsInk.content).toContain("世界第一的公主殿下是？");
      expect(questionsInk.content).toContain("以下哪个是 VOCALOID 软件？");
      expect(questionsInk.content).toContain("太阳从东方升起。");
      expect(questionsInk.content).toContain("水的化学式是 H2O。");
      expect(questionsInk.content).toContain("1 + 1 = ?");
    });

    it("should include question options", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const questionsInk = result.files.find((f) => f.path === "questions.ink");
      expect(questionsInk).toBeDefined();
      if (!questionsInk) return;

      expect(questionsInk.content).toContain("cona");
      expect(questionsInk.content).toContain("miku");
      expect(questionsInk.content).toContain("pazu");
      expect(questionsInk.content).toContain("lbxx");
    });

    it("should include answer explanations", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const questionsInk = result.files.find((f) => f.path === "questions.ink");
      expect(questionsInk).toBeDefined();
      if (!questionsInk) return;

      expect(questionsInk.content).toContain("初音未来是世界第一的公主殿下");
      expect(questionsInk.content).toContain("这是基本的天文知识");
      expect(questionsInk.content).toContain("基础数学");
    });

    it("should include result categories", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("继续努力");
      expect(surveyInk.content).toContain("不错");
      expect(surveyInk.content).toContain("优秀");
    });

    it("should include pass score check", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("score >= 60");
      expect(surveyInk.content).toContain("放榜");
    });

    it("should use survey mode when isExam is false", () => {
      const data = createTestData();
      data.tables.config = {
        headers: ["key", "value"],
        rows: [{ key: "isExam", value: "false" }],
        lookup: {},
      };

      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("问卷");
      expect(surveyInk.content).not.toContain("考试");
    });

    it("should use default pass score when not configured", () => {
      const data = createTestData();
      data.tables.config = {
        headers: ["key", "value"],
        rows: [],
        lookup: {},
      };

      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("score >= 60");
    });

    it("should calculate total score correctly", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("VAR max = 5");
    });

    it("should use custom max questions", () => {
      const data = createTestData();
      data.tables.config = {
        headers: ["key", "value"],
        rows: [{ key: "maxQuestions", value: "3" }],
        lookup: {},
      };

      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("VAR max = 3");
    });

    it("should generate shuffle function when randomize is true", () => {
      const data = createTestData();
      const result = generator.generate(data);
      const surveyInk = result.files.find((f) => f.path === "index.md");
      expect(surveyInk).toBeDefined();
      if (!surveyInk) return;

      expect(surveyInk.content).toContain("get_next_question");
      expect(surveyInk.content).toContain("LIST_RANDOM");
    });
  });
});
