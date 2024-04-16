import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { data } from "./utils"

export default async function Dashboard() {
    const supabase = createClient()

    const { data: { session }, error } = await supabase.auth.getSession()
    console.log(session, error)

    if (error || !session?.user) {
        //    redirect('/')
    }
    // Make sample dictionary containing the data as {day-edited: {cards: {title: "title", description: "description"}}}


    return (
        <>
            <div className="w-[80%] flex flex-col mx-auto my-24 gap-24">
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl font-bold">Dashboard</h1>
                    <div className="flex flex-row gap-2 rounded-full bg-[#252525] p-1 max-w-[30rem] min-w-[10rem]">
                        <img className="px-1" src="search.svg" alt="yo"></img>
                        <input type="text" placeholder="Search" className="bg-transparent text-white w-full outline-none" />
                    </div>
                </div>
                {Object.keys(data).map((key) => {
                    return (
                        <>
                            <h1 className="text-2xl font-bold">{key}</h1>
                            <div className="flex flex-row flex-wrap gap-12">
                                {data[key]["cards"].map((card, index) => {
                                    return (
                                        <div className="rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl hover:scale-105 transform-gpu">
                                            <Card key={index} className="w-[22rem] h-[18rem] bg-[#181818]">
                                                <CardHeader>
                                                    <CardTitle>{card["title"]}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <CardDescription>{card["description"]}</CardDescription>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    );
                })}

            </div>
        </>
    );
}

