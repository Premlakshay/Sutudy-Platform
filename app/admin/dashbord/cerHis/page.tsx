"use client";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import * as React from "react";
import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
export default function Home(){
    const [data, setData] = React.useState([]);
    const coloums = [
        {
            dataField: "name",
            text: "Name",
            filter: textFilter()
        },
        {
            dataField: "ExamName",
            text: "Course-Name",
            filter: textFilter()
        },
        {
            dataField: "ObtainedMarks",
            text: "Obtained Marks",
        },
        {
            dataField: "TotalMarks",
            text: "Total Marks",
        },
        {
            dataField: "userId",
            text: "Gmail-ID",
            filter: textFilter()
        },
        {
            dataField: "fName",
            text: "Father-Name",
        },
        {
            dataField: "mName",
            text: "Mother-Name",
        },
        {
            dataField: "iName",
            text: "Institute-Name",
        },
        {
            dataField: "date",
            text: "Issue Date",
        },
    ]
    React.useEffect(()=>{
        ( async () => {
            const response = await fetch('/api/admin/cerHis', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data.data);
            setData(data.data);
        })();
    },[]);
    return (
        <>
            <div className="flex justify-center items-center mx-auto mt-4">
            {data.length > 0 ? (<>
                <BootstrapTable keyField="_id" data={data} columns={coloums} pagination={paginationFactory()} striped hover condensed filter={filterFactory()}/>
            </>): (<>
                Records are in Loding State or no Records Found
            </>)}
            </div>
        </>
    )
}