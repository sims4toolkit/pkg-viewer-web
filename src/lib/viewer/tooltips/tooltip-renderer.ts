import ViewerState from "../viewer-state";
import type { TooltipContent, TooltipFooter, TooltipImageContent, TooltipInfo, TooltipUrlFooter } from "./tooltip-info";

/**
 * Renders an `HTMLDivElement` for the given tooltip.
 * 
 * @param tooltip Tooltip to render
 */
export function renderTooltip(tooltip: TooltipInfo): HTMLDivElement {
  const dom = document.createElement("div");
  dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");
  if (tooltip.title) _renderTitle(dom, tooltip.title);
  tooltip.content?.forEach(item => _renderContentItem(dom, item));
  if (tooltip.footer) _renderFooter(dom, tooltip.footer);
  return dom;
}

//#region Renderers

function _renderTitle(dom: HTMLDivElement, title: string) {
  _addPlainTextToDom(dom, title, ["uppercase", "text-xs", "font-bold", "text-subtle"]);
}

function _renderContentItem(dom: HTMLDivElement, content: TooltipContent) {
  switch (content.type) {
    case "text":
      _addPlainTextToDom(dom, content.text, content.classes);
      return;
    case "html":
      _addHtmlToDom(dom, content.html);
      return;
    case "image":
      _addImageToDom(dom, content);
      return;
  }
}

function _renderFooter(dom: HTMLDivElement, footer: TooltipFooter) {
  const hr = document.createElement("hr");
  hr.classList.add("opacity-20", "w-full");
  dom.appendChild(hr);

  switch (footer.type) {
    case "file":
      _addButtonToDom(dom, "Go to File", () => {
        ViewerState.requestFile(footer.fileId, true);
      });
      return;
    case "url":
      _addExternalLinkToDom(dom, footer);
      return;
  }
}

//#endregion

//#region Helpers

function _addPlainTextToDom(dom: HTMLDivElement, text: string, classes?: string[]) {
  const p = document.createElement("p");
  if (classes?.length) p.classList.add(...classes);
  p.textContent = text;
  dom.appendChild(p);
}

function _addHtmlToDom(dom: HTMLDivElement, html: string) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  dom.appendChild(wrapper);
}

function _addImageToDom(dom: HTMLDivElement, content: TooltipImageContent) {
  const wrapper = document.createElement("div");
  const img = document.createElement("img");

  img.classList.add("border", "border-solid", "border-black", "dark:border-white");
  img.alt = "Not Found";
  img.style.maxWidth = "120px";
  img.style.maxHeight = "100px";
  img.src = content.source;
  wrapper.appendChild(img);

  if (content.dimensions) {
    const p = document.createElement("p");
    p.classList.add("mt-1", "text-subtle", "text-center", "text-xs");
    p.textContent = content.dimensions;
    wrapper.appendChild(p);
  }

  dom.appendChild(wrapper);
}

function _addButtonToDom(dom: HTMLDivElement, text: string, onClick: () => void) {
  const button = document.createElement("button");
  button.classList.add("text-secondary");
  button.textContent = text;
  button.onclick = onClick;
  dom.appendChild(button);
}

function _addExternalLinkToDom(dom: HTMLDivElement, footer: TooltipUrlFooter) {
  const a = document.createElement("a");
  a.classList.add("text-secondary");
  a.textContent = footer.text;
  a.href = footer.href;
  a.target = "_blank";

  const p = document.createElement("p");
  p.appendChild(a);

  if (footer.attribution) p.appendChild(
    document.createTextNode(` (From: ${new URL(footer.attribution).hostname})`)
  );

  dom.appendChild(p);
}

//#endregion
