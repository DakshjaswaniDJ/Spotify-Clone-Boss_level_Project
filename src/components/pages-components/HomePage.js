import React, {useState, useEffect, useContext} from 'react'

import CollectionRow from '../featured-components/CollectionRow'

import makeAxiosRequest from '../../utilities/makeAxiosRequest'
import getLocale from '../../utilities/locale'
import { MessageContext } from '../../utilities/context'


export default function HomePage() {
    const setMessage = useContext(MessageContext)
    const [collections, setCollections] = useState([])
    const [temp, setTemp] = useState({})
    const [playlistsMap, setplaylistMap] = useState({})

    
    useEffect(() => {
        const [language, locale] = getLocale()
        const [source, makeRequest] = makeAxiosRequest(`https://api.spotify.com/v1/browse/categories?limit=6&country=${locale}&locale=${language}_${locale}`)
        makeRequest()
            .then((data) => {
                setCollections(data.categories.items)
            })
            .catch((error) => setMessage(`ERROR: ${error}`))
        
        return () => source.cancel()
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        collections.map((collection) => {
            const {name, id} = collection
            var [, makeRequest] = makeAxiosRequest(`https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=9`)
            makeRequest()
                .then((data) => {
                    const playlists = data.playlists.items
                    setTemp(temp => ({[name]: {id, playlists}}))
                })
                .catch((error) => setMessage(`ERROR: ${error}`))
            return null
        })
    // eslint-disable-next-line
    }, [collections])


    useEffect(() => {
        setplaylistMap(playlistsMap => ({...playlistsMap, ...temp}))
    // eslint-disable-next-line
    }, [temp])

    return (
        <div className="page-content">
            <div className='pageContent'>
                <CollectionRow name='Uniquely Yours' id={null} playlists={[{id:'', to:'/tracks', description:'', name:'Liked Songs', images:[{url: 'https://misc.scdn.co/liked-songs/liked-songs-300.png'}]}]}/>
                {   
                    Object.entries(playlistsMap).map(([name, info]) => {
                        const {id, playlists} = info
                        return <CollectionRow name={name} key={id} id={id} playlists={playlists}/>
                    })
                }
                <CollectionRow name='Recently Played' id={null} playlists={[{id:'', to:'/tracks', description:'', name:'Bella Ciao', images:[{url: 'data:image/jpeg;base64,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'}]}]}/>
                {   
                    Object.entries(playlistsMap).map(([name, info]) => {
                        const {id, playlists} = info
                        return <CollectionRow name={name} key={id} id={id} playlists={playlists}/>
                    })
                }
                
            </div>
        </div>
    )
}


