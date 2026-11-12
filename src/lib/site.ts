export const site = {
  name: "JXK · Tech Notes",
  description: "记录技术学习，分享工程实践，沉淀编程知识。",
};

export const sections = [
  {
    key: "learning",
    label: "学习笔记",
    description: "以专题串联知识，用章节记录理解。",
    mark: "01",
  },
  {
    key: "algorithms",
    label: "算法题解",
    description: "从问题出发，梳理思路与复杂度。",
    mark: "02",
  },
  {
    key: "practices",
    label: "技术实践",
    description: "记录工程实验、性能观察与实践经验。",
    mark: "03",
  },
  {
    key: "thoughts",
    label: "技术思考",
    description: "留下一些关于技术与工程取舍的思考。",
    mark: "04",
  },
] as const;

export const routes = {
  home: "/",
  section: (key: (typeof sections)[number]["key"]) => `/${key}/`,
  learningSeries: (series: string) => `/learning/${series}/`,
  learningArticle: (id: string) => `/learning/${id}/`,
  algorithmArticle: (id: string) => `/algorithms/${id}/`,
};

// 技术实践与技术思考已移出第一阶段范围，暂不提供入口。
export const activeSections = sections.filter(
  (section) => section.key === "learning" || section.key === "algorithms",
);

export const navigation = [
  { label: "首页", href: routes.home },
  ...activeSections.map((section) => ({
    label: section.label,
    href: routes.section(section.key),
  })),
];
