{
  "name": "OZA Seed",
  "version": "19.0.1.5",
  "depends": ["base", "contacts", "project"],
  "data": [
    "data/res.partner.csv",
    "data/project.project.csv",
    "data/project.task.csv",
  ],
  "post_init_hook": "_oza_install_apps",
  "installable": True,
  "auto_install": True
}
