import { Fragment, h, render } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import './style.css'

interface SessionElementProps {
    session: chrome.sessions.Session
    updateCallback: () => void
}

function getDefaultFaviconUrl(): string {
    return chrome.runtime.getURL("icons/recentabs32.png")
}

function getValidFaviconUrl(tab: chrome.tabs.Tab): string {
    if (tab.favIconUrl)
        return tab.favIconUrl
    if (tab.url) {
        try {
            return new URL('/favicon.ico', tab.url).toString()
        } catch (_) {}
    }
    return getDefaultFaviconUrl()
}

function Session({session, updateCallback}: SessionElementProps) {
    const tab = session.tab

    const [faviconUrl, setFaviconUrl] = useState(getValidFaviconUrl(tab))

    const imgOnErrorCallback = useCallback(() => {
        setFaviconUrl(getDefaultFaviconUrl())
    }, [tab.favIconUrl])

    const clickCallback = useCallback(() => {
        chrome.sessions.restore(tab.sessionId)
        updateCallback()
    }, [session])

    return (
        <div class="session" onClick={clickCallback}>
            <img class="favicon" src={faviconUrl} onError={imgOnErrorCallback}/>
            <span class="title">{tab.title}</span>
        </div>
    )
}

function getRecentTabs(): Promise<chrome.sessions.Session[]> {
    return new Promise((resolve) => {
        chrome.sessions.getRecentlyClosed(null, list => {
            resolve(list)
        })
    })
}

function Popup() {

    const [sessList, setSessList] = useState<chrome.sessions.Session[]>(undefined)

    useEffect(() => {
        if (sessList == undefined) {
            getRecentTabs().then(list => setSessList(list))
        }
    })

    const updateCallback = useCallback(() => {
        getRecentTabs().then(list => setSessList(list))
    }, [sessList])

    return (
        <Fragment>
            <div class="header">
                <h3>Recently Closed Tabs<span class="counter">{sessList ? sessList.length : 0} tabs</span></h3>
            </div>
            <div class="sessionList">
                { sessList && sessList.length > 0
                    && sessList.map(sess => <Session session={sess} updateCallback={updateCallback} />)
                }
            </div>
        </Fragment>
    )
}

render(<Popup />, document.body)
