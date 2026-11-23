import authors from './authors'
import { GithubIcon, GlobeIcon, LinkedinIcon } from 'lucide-react'

type AuthorType = {
    author: keyof typeof authors,

}

export const BlogAuthor = (
    {author}: AuthorType
) => {
    const authorDetails = authors[author]

    return (
        <div style={{marginTop: 10}} data-pagefind-ignore="all">
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 10}}>
                <div style={{
                    borderRadius: '50%',
                    width: 40,
                    maxWidth: 40,
                    height: 40,
                    maxHeight: 40,
                    overflow: 'hidden'
                }}>
                    <img src={authorDetails.avatar} alt='author avatar'/>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span style={{fontWeight: 500}}>{authorDetails.fullname}</span>
                    <span><i style={{fontSize: 12}}>{authorDetails.tagline}</i></span>
                </div>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 15, gap: 10}}>
                <a href={authorDetails.links.github} target='_blank'><GithubIcon width={20} height={20}/></a>
                <a href={authorDetails.links.in} target='_blank'><LinkedinIcon width={20} height={20}/></a>
                <a href={authorDetails.links.website} target='_blank'><GlobeIcon width={20} height={20}/></a>
            </div>
        </div>
    )
}