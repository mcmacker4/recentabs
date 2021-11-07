import { Fragment, h, render } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import './style.css'

interface SessionElementProps {
    session: chrome.sessions.Session
    updateCallback: () => void
}

function Session({session, updateCallback}: SessionElementProps) {
    const tab = session.tab

    const faviconUrl = tab.favIconUrl
        || (tab.url && new URL('/favicon.ico', tab.url).toString())

    const clickCallback = useCallback(() => {
        chrome.sessions.restore(tab.sessionId)
        updateCallback()
    }, [session])

    return (
        <div class="session" onClick={clickCallback}>
            <img class="favicon" src={faviconUrl} />
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
