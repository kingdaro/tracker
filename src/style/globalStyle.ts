import { css } from "@emotion/core"
import { primaryBackgroundColor, primaryTextColor } from "./colors"

export default css`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    word-break: break-word;
  }

  :root {
    font: 16px Roboto;
    background: ${primaryBackgroundColor};
    color: ${primaryTextColor};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Roboto Condensed";
    font-weight: 300;
  }

  button,
  input,
  textarea,
  select,
  option {
    background: none;
    border: 0;
    font: inherit;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  img,
  svg {
    vertical-align: bottom;
  }
`
