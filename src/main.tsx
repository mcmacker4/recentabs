import { Fragment, h, render } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import './style.css'

interface SessionElementProps {
    session: browser.sessions.Session
    updateCallback: () => void
}

function Session({session, updateCallback}: SessionElementProps) {
    const tab = session.tab

    const clickCallback = useCallback(() => {
        browser.sessions.restore(tab.sessionId)
        updateCallback()
    }, [session])

    return (
        <div class="session" onClick={clickCallback}>
            <img class="favicon" src={tab.favIconUrl} />
            <span class="title">{tab.title}</span>
        </div>
    )
}

async function getRecentTabs(): Promise<browser.sessions.Session[]> {
    const list = await browser.sessions.getRecentlyClosed()
    return list.filter(sess => sess.tab)
}

function Popup() {

    const [sessList, setSessList] = useState<browser.sessions.Session[]>(undefined)

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
                <h3>Recently Closed Tabs</h3>
            </div>
            <div class="sessionlist">
                { sessList && sessList.length > 0
                    && sessList.map(sess => <Session session={sess} updateCallback={updateCallback} />)
                }
            </div>
        </Fragment>
    )
}

render(<Popup />, document.body)
