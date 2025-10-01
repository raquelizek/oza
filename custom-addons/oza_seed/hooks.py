from odoo.api import Environment, SUPERUSER_ID

def _get_env_from_hook_args(cr_or_env, registry=None):
    if hasattr(cr_or_env, "cr") and isinstance(getattr(cr_or_env, "uid", None), int):
        return cr_or_env
    return Environment(cr_or_env, SUPERUSER_ID, {})

def _install_modules(env, modules):
    to_install = env["ir.module.module"].search([
        ("name", "in", modules),
        ("state", "!=", "installed"),
    ])
    if to_install:
        to_install.button_install()
        env.cr.commit()

def _oza_install_apps(cr_or_env, registry=None):
    env = _get_env_from_hook_args(cr_or_env, registry)

    modules = [
        "project",
        "calendar",
        "mail",
        "contacts",
        "website",
        "documents",
        "knowledge",
        "board",
        "website_slides",
    ]

    Module = env["ir.module.module"]
    if Module.search([("name", "=", "sale_management")], limit=1):
        modules.append("sale_management")
    elif Module.search([("name", "=", "sale")], limit=1):
        modules.append("sale")

    _install_modules(env, modules)
