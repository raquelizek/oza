{
    "name": "OZA Branding",
    "version": "19.0.1.0.0",
    "summary": "Troca textos e identidade visual de Odoo para OZA",
    "depends": ["web", "website"],
    "data": [
        "views/web_layout.xml",
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
    "application": True,
}
