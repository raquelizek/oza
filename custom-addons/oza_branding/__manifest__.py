{
    "name": "OZA Branding",
    "version": "19.0.1.0.0",
    "summary": "Troca textos e identidade visual de Odoo para OZA",
    "depends": ["web"],
    "data": [
        "data/app_icons.xml",
        "views/web_layout.xml",
        "data/ir_config_parameter.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            "oza_branding/static/src/scss/oza_branding.scss",
        ],
        "web.assets_backend": [
            "oza_branding/static/src/scss/oza_branding.scss",
        ],
        "web.report_assets_common": [
            "oza_branding/static/src/scss/oza_branding.scss",
        ],
    },
    "installable": True,
    "application": False,
}
