import { FileDescriptionTable } from "./src/file-description-table";

new FileDescriptionTable(12, ['cb', 'before']).getFDT(11).then( result => {
    console.log(result);
});