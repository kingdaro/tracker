import { css } from "@emotion/core"
import {
  mdiCheckCircle,
  mdiPlaylistCheck,
  mdiPlus,
  mdiTrashCan,
  mdiViewDashboard,
} from "@mdi/js"
import { Link, Redirect, RouteComponentProps, Router } from "@reach/router"
import gql from "graphql-tag"
import idx from "idx"
import React, { useEffect, useState } from "react"
import { useClient } from "../apollo/hooks"
import { UpcomingAnimeQuery } from "../generated/graphql"
import { primaryColor, primaryTextColor } from "../style/colors"
import FlatButton from "../style/FlatButton"
import { flexColumn, flexGrow, flexRow } from "../style/flex"
import {
  anchorBottom,
  coveredBackgroundImage,
  fillArea,
  fullHeight,
  scrollVertical,
  shadeBg,
} from "../style/helpers"
import Icon from "../style/Icon"
import NavLink from "./NavLink"

export default function App() {
  const navStyle = css`
    background-color: ${primaryColor};
    z-index: 1;
    ${dropShadow};
  `

  return (
    <main css={[flexColumn, fullHeight]}>
      <nav css={[navStyle, flexRow, { alignItems: "center" }]}>
        <Link to="/" css={[flexGrow, { padding: "1rem" }]}>
          <h1>awesome anime tracker</h1>
        </Link>

        <NavLink to="/upcoming">
          <Icon name={mdiViewDashboard} />
        </NavLink>

        <NavLink to="/tracked">
          <Icon name={mdiPlaylistCheck} />
        </NavLink>
      </nav>
      <section css={[scrollVertical, flexGrow]}>
        <Router>
          <Redirect from="/" to="/upcoming" />
          <UpcomingAnimePage path="/upcoming" />
          <TrackedAnimePage path="/tracked" />
          <NotFoundPage default />
        </Router>
      </section>
    </main>
  )
}

function NotFoundPage(props: RouteComponentProps) {
  return <p>Page not found :(</p>
}

function UpcomingAnimePage(props: RouteComponentProps) {
  const client = useClient()
  const [pages, setPages] = useState<UpcomingAnimeQuery.Page[]>([])

  async function loadMediaItems() {
    const prevPage = pages[pages.length - 1]
    if (prevPage && !prevPage.pageInfo!.hasNextPage) return

    const prevPageNum = (prevPage && prevPage.pageInfo!.currentPage) || -1

    const result = await client.query<
      UpcomingAnimeQuery.Query,
      UpcomingAnimeQuery.Variables
    >({
      query: upcomingAnimeQuery,
      variables: { page: prevPageNum + 1 },
    })

    const pageData = result.data.Page
    if (!pageData) return

    setPages([...pages, pageData])
  }

  useEffect(() => {
    loadMediaItems()
  }, [])

  const animeCardListStyle = css`
    display: grid;
    grid-gap: 2rem;
    padding: 2rem;
    grid-template-columns: repeat(auto-fill, 320px);
    grid-auto-rows: 450px;
    justify-content: center;
    max-width: 1500px;
    margin: 0 auto;
  `

  return (
    <>
      <ul css={[animeCardListStyle]}>
        {pages.map((page) =>
          page.media!.map((media) => (
            <li key={media!.id}>
              <AnimeSummaryCard media={media!} />
            </li>
          )),
        )}
      </ul>

      <button onClick={loadMediaItems}>load more</button>
    </>
  )
}

const upcomingAnimeQuery = gql`
  query UpcomingAnimeQuery($page: Int!) {
    Page(page: $page, perPage: 24) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: ANIME, season: WINTER, seasonYear: 2019) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
        bannerImage
        genres
        format
      }
    }
  }
`

const dropShadow = css`
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
`

const trackedAnimeEntry = css`
  align-items: center;
  background-color: ${primaryColor};
  padding: 0.5rem;
  max-width: 500px;
  margin: 0 auto;

  ${dropShadow};
`

function AnimeSummaryCard({ media }: { media: UpcomingAnimeQuery.Media }) {
  const coverImage = idx(media, (_) => _.coverImage.large)
  const title = idx(media, (_) => _.title.romaji) || "(unknown title)"
  const titleAlt = idx(media, (_) => _.title.english) || title
  const genres = media.genres || []
  const format = media.format

  const container = css`
    width: 100%;
    height: 100%;

    ${dropShadow};

    position: relative;

    background-color: ${primaryColor};
    ${coverImage && coveredBackgroundImage(coverImage)};
  `

  const infoContainerStyle = css`
    padding: 0.75rem;
  `

  const titleStyle = css`
    font-size: 1.3rem;
  `

  const infoLineStyle = css`
    font-size: 0.8rem;
    opacity: 0.75;
    margin-top: 0.3rem;
    font-style: italic;
  `

  return (
    <div css={container}>
      <div css={[fillArea]} />

      <div css={[flexRow, anchorBottom, shadeBg]}>
        <div css={[infoContainerStyle, flexGrow]}>
          <h3 css={titleStyle}>{title}</h3>

          {titleAlt !== title && <div css={infoLineStyle}>{titleAlt}</div>}

          <div css={infoLineStyle}>
            {[format, genres.join(", ")].filter(Boolean).join(" - ")}
          </div>
        </div>

        <div css={{ alignSelf: "flex-end" }}>
          <FlatButton>
            <Icon name={mdiPlus} />
          </FlatButton>
        </div>
      </div>
    </div>
  )
}

function TrackedAnimePage(props: RouteComponentProps) {
  return (
    <ul css={{ display: "grid", gridGap: "1rem", padding: "1rem" }}>
      <li>
        <TrackedAnimeEntry />
      </li>
      <li>
        <TrackedAnimeEntry />
      </li>
      <li>
        <TrackedAnimeEntry />
      </li>
      <li>
        <TrackedAnimeEntry />
      </li>
      <li>
        <TrackedAnimeEntry />
      </li>
    </ul>
  )
}

function TrackedAnimeEntry() {
  return (
    <div css={[flexRow, trackedAnimeEntry]}>
      <span css={[flexGrow, { padding: "0.5rem" }]}>Cute Anime</span>
      <span css={{ padding: "0.5rem" }}>5 / 6</span>
      <FlatButton>
        <Icon size={1} name={mdiCheckCircle} color={primaryTextColor} />
      </FlatButton>
      <FlatButton>
        <Icon size={1} name={mdiTrashCan} color={primaryTextColor} />
      </FlatButton>
    </div>
  )
}
