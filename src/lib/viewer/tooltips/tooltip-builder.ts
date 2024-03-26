import type { TooltipContent, TooltipFooter, TooltipInfo } from "./tooltip-info";

export default class TooltipBuilder {
  private _title?: string;
  private _content?: TooltipContent[];
  private _footer?: TooltipFooter;

  /**
   * Creates the `TooltipInfo` object.
   */
  build(): TooltipInfo {
    // if title is redundant, remove it
    if (this._title && this._content?.length) {
      const firstContent = this._content[0];
      if (firstContent.type === "text") {
        const lowerTitle = this._title.toLowerCase();
        const lowerContent = firstContent.text.toLowerCase();
        if (lowerTitle === lowerContent) delete this._title;
      }
    }

    return {
      title: this._title,
      content: this._content,
      footer: this._footer
    };
  }

  /**
   * Set the title for the tooltip. Title will be ignored if the first content
   * item is text equal to the title.
   * 
   * @param title Title to use
   */
  setTitle(title: string): TooltipBuilder {
    this._title = title;
    return this;
  }

  /**
   * Add plain text to the body content.
   * 
   * @param text Plain text to add
   * @param classes Classes to add to the `<p>` element
   */
  addTextContent(text: string, classes?: string[]): TooltipBuilder {
    this._content ??= [];
    this._content.push({ type: "text", text, classes });
    return this;
  }

  /**
   * Add HTML to the body content.
   * 
   * @param html HTML content to add
   */
  addHtmlContent(html: string): TooltipBuilder {
    this._content ??= [];
    this._content.push({ type: "html", html });
    return this;
  }

  /**
   * Add a rendered image to the body content.
   * 
   * @param source Source of image element
   * @param options Optional arguments (including image dimensions)
   */
  addImageContent(
    source: string,
    options?: Partial<{
      width: string;
      height: string;
    }>
  ): TooltipBuilder {
    this._content ??= [];
    let dimensions: string = undefined;
    if (options?.width && options?.height)
      dimensions = `${options.width} x ${options.height}`;
    this._content.push({ type: "image", source, dimensions });
    return this;
  }

  /**
   * Set a link to a file within the package to the footer. Replaces any other
   * links already in the footer.
   * 
   * @param fileId ID of file to link to
   */
  setFooterFile(fileId: number): TooltipBuilder {
    this._footer = { type: "file", fileId };
    return this;
  }

  /**
   * Set a link to an external page in the footer. Replaces any other links
   * already in the footer.
   * 
   * @param href HREF of external link
   * @param attribution URL to use for attribution, if different from href
   */
  setFooterUrl(href: string, attribution?: string): TooltipBuilder {
    this._footer = { type: "url", href, attribution };
    return this;
  }
}
