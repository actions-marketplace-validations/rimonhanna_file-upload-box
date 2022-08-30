# File Upload Box

Upload to Box.

## Inputs

`CLIENT_ID`: Box App Client ID.<br>
`CLIENT_SECRET`: Box App client secret.<br>
`ENTERPRISE_ID`: Box App Enterprise ID.<br>
`SOURCE_PATH`: Source file path(s) to be uploaded to Box. Separate multiple files using a semicolon.<br>
`DESTINATION_FOLDER_ID`: Box destination folder ID, last part of the url when you navigate to the folder in your browser.<br>


## Outputs:
`DOWNLOAD_URLs`: Box file(s) download url.<br>

## Assumptions

- Follow [box](https://developer.box.com/guides/authentication/client-credentials/client-credentials-setup/) docs to generate client id and secret
- Multiple files are uploaded to the same destination path.

## Example Usage

```yaml
...

- name: Box File Upload
  uses: rimonhanna/file-upload-box@v1.0.0
  with:
    CLIENT_ID: ${{ secrets.BOX_CLIENT_ID }}
    CLIENT_SECRET: ${{ secrets.BOX_CLIENT_SECRET }}
    ENTERPRISE_ID: ${{ secrets.BOX_ENTERPRISE_ID }}
    DESTINATION_FOLDER_ID: ${{ secrets.BOX_FOLDER_ID }}
    SOURCE_PATH: dist/my-file.txt
    # or for multiple files
    # SOURCE_PATH: dist/my-file1.txt;dist/my-file2.txt

...
```