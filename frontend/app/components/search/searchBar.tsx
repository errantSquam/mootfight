import { useContext } from "react"
import { MootButton } from "../button"
import { SearchContext } from "~/provider/searchProvider"
import { Link, useNavigate } from "react-router"

export const SearchBar = () => {

    const {searchQuery, setSearchQuery} = useContext(SearchContext)

    let navigate = useNavigate()

    return <div className="flex flex-col w-full items-center">
              <h3> Search </h3>
              <input type="text" className="py-1 px-2 w-1/2 border border-zinc-500"
                placeholder="Search user/character..." 
                value = {searchQuery}
                onChange = {(e) => {
                    setSearchQuery(e.target.value)
                    }}/>
              <div className="flex flex-row w-1/2 px-8 py-4 justify-center space-x-4">
                
                <MootButton onClick = {() => {
                    navigate(`/search?type=user&query=${searchQuery !== undefined ? searchQuery : ''}` )
                    }}>
                    Search User
                </MootButton>
    
                <MootButton onClick = {() => {
                    navigate(`/search?type=character&query=${searchQuery !== undefined ? searchQuery : ''}`)
                    }}>
                    Search Character
                </MootButton>
              </div>
              </div>
}