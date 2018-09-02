import { createReadStream } from "fs";

describe("Upload", () => {
  it("Finds a record and uploads a file", () => {
    return client
      .find({
        data: {
          query: [
            {
              name: "Dave"
            }
          ]
        }
      })
      .then(r => {
        const id = r.response.data[0].recordId;

        const fileStream = createReadStream(__dirname + "/test1.png");
        return client.upload({
          recordId: id,
          containerFieldName: "avatar",
          containerFieldRepetition: 3,
          data: fileStream
        });
      });
  });
});
