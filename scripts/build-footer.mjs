/** The publication footer names the build commit (layouts/_partials/custom/footer.html). Only the footer
 * anchor counts: one <p class=site-build>, whose data-build-commit is exactly 40 hex and matches its own
 * commit href. Shared by verify-deployed.mjs and indexnow.mjs; contract SSOT: docs/deploy-cloudflare.md.
 */
export const footerCommit = (html) => {
	const footers = html.match(/<p class=["']?site-build["']?>[\s\S]*?<\/p>/g) ?? [];
	if (footers.length !== 1) return { error: `${footers.length} build footers` };
	const anchor = footers[0].match(/<a href=["']?https:\/\/github\.com\/junghan0611\/homepage\/commit\/([0-9a-f]{40})["']?\s[^>]*\bdata-build-commit=["']?([0-9a-f]{40})(?=["'\s>])/);
	if (!anchor) return { error: "no commit anchor in the build footer" };
	if (anchor[1] !== anchor[2]) return { error: `footer href ${anchor[1]} and data-build-commit ${anchor[2]} disagree` };
	return { commit: anchor[1] };
};
