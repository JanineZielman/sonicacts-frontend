import { getPageData } from "../../lib/api"

export default async function handler(req, res) {
	if (req.query.secret !== (process.env.STRAPI_PREVIEW_SECRET || 'secret-token')) {
		return res.status(401).json({ message: req.query.type.replace('-item', '') });
	}

	const pageData = await getPageData(req.query.slug, true, req.query.type);

	if (!pageData) {
		return res.status(401).json({ message: "Invalid slug" });
	}

	res.setPreviewData({});

	res.writeHead(307, { Location: `/${req.query.type.replace('-item', '')}/${req.query.slug}` });
	res.end();
};