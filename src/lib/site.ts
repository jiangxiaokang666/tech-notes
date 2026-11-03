export const site = {
  name: "Tech Notes",
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
  about: "/about/",
  learningSeries: (series: string) => `/learning/${series}/`,
  learningArticle: (id: string) => `/learning/${id}/`,
};

export const navigation = [
  { label: "首页", href: routes.home },
  ...sections.map((section) => ({
    label: section.label,
    href: routes.section(section.key),
  })),
  { label: "关于", href: routes.about },
];
