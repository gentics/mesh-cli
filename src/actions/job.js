function clearJob(env, options) {
    var id = null;
    rest.delete("/api/v1/admin/jobs/" + id + "/error").end(r => {
        if (rest.check(r, 200, "Could not clear errors of job " + id)) {
            console.log("Cleared errors for job '" + id + "'");
        }
    });
}

function listJobs() {
    rest.get("/api/v1/admin/jobs").end(r => {
        if (rest.check(r, 200, "Could not load jobs")) {
            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name'],
                colWidths: [34, 15]
            });

            json.data.forEach((element) => {
                table.push([element.uuid, element.name]);
            });
            console.log(table.toString());
        }
    });
}