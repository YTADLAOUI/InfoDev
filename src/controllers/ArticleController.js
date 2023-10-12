const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ArticleController {
  static index = async (req, res) => {
    const articles = await prisma.article.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    res.render("articles/index", { title: "articles", articles });
  };

  static show = async (req, res) => {
    const { id } = req.params;
    const currentUserId = Number(JSON.parse(req.cookies.userInfo).id);

    const article = await prisma.article.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        author: {
          select: {
            id: true,
            photo: true,
            name: true,
            bio: true,
          },
        },
        comment: {
          include: {
            user: {
              select: {
                id: true,
                photo: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.render("articles/show", { title: "article", article, currentUserId });
  };

  static add = async (req, res) => {
    res.render("articles/add", { title: "add article" });
  };

  static store = async (req, res) => {
    const { title, content } = req.body;
    const user_id = JSON.parse(req.cookies.userInfo).id;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId: Number(user_id),
      },
    });

    res.redirect("/articles");
  };

  static edit = async (req, res) => {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: {
        id: Number(id),
      },
    });

    res.render("articles/edit", { title: "edit article", article });
  };

  static update = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const article = await prisma.article.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
      },
    });

    res.redirect(`/articles/${id}`);
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const article = await prisma.article.update({
      where: {
        id: Number(id),
      },
      data: {
        isDeleted: true,
      },
    });

    res.redirect("/articles");
  };
}

module.exports = ArticleController;
