///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 26

import java.io.*;
import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

void main() throws Exception {
    var pageUrl = "https://web.archive.org/web/20260202165434/https://epub.ganjoor.net/";
    var outputDir = Path.of("booklets");
    Files.createDirectories(outputDir);

    var client = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.ALWAYS)
            .build();

    IO.println("Fetching page: " + pageUrl);
    var pageResponse = client.send(
            HttpRequest.newBuilder(URI.create(pageUrl)).GET().build(),
            HttpResponse.BodyHandlers.ofString());

    if (pageResponse.statusCode() != 200) {
        IO.println("Failed to fetch page: HTTP " + pageResponse.statusCode());
        System.exit(1);
    }

    var pattern = Pattern.compile("href=\"([^\"]*\\.epub)\"");
    var matcher = pattern.matcher(pageResponse.body());
    var urls = new ArrayList<String>();
    while (matcher.find()) {
        var url = matcher.group(1);
        urls.add(toRawWaybackUrl(url));
    }

    IO.println("Found " + urls.size() + " epub files");

    var downloaded = 0;
    var skipped = 0;
    var failed = 0;

    for (var url : urls) {
        var fileName = url.substring(url.lastIndexOf('/') + 1);
        var targetPath = outputDir.resolve(fileName);

        if (Files.exists(targetPath)) {
            skipped++;
            IO.println("[SKIP] " + fileName + " (already exists)");
            continue;
        }

        try {
            var count = downloaded + skipped + failed + 1;
            IO.print("[" + count + "/" + urls.size() + "] Downloading " + fileName + "...");
            var response = client.send(
                    HttpRequest.newBuilder(URI.create(url)).GET().build(),
                    HttpResponse.BodyHandlers.ofFile(targetPath));

            if (response.statusCode() == 200) {
                var size = Files.size(targetPath);
                IO.println(" done (" + size / 1024 + " KB)");
                downloaded++;
            } else {
                IO.println(" HTTP " + response.statusCode());
                Files.deleteIfExists(targetPath);
                failed++;
            }
        } catch (Exception e) {
            IO.println(" ERROR: " + e.getMessage());
            Files.deleteIfExists(targetPath);
            failed++;
        }
    }

    IO.println("\nComplete: " + downloaded + " downloaded, " + skipped + " skipped, " + failed + " failed");
}

// Convert a Wayback Machine replay URL to a raw (id_) URL to get the original binary content
static String toRawWaybackUrl(String url) {
    return url.replaceFirst(
            "(web\\.archive\\.org/web/\\d+)/",
            "$1id_/");
}
