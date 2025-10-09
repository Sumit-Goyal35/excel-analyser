import XLSX from "xlsx";
import path from "path";
import fs from "fs";

class ExcelService {
  static async parseExcelFile(filePath) {
    try {
      // Normalize Windows/Unix paths
      const normalizedPath = path.resolve(filePath);
      console.log("📊 Parsing Excel file:", normalizedPath);

      // Wait for file to be completely written and accessible
      await this.waitForFileAccess(normalizedPath);

      // Read file as buffer first (more reliable on Windows)
      const fileBuffer = fs.readFileSync(normalizedPath);
      console.log("📄 File buffer size:", fileBuffer.length, "bytes");

      if (fileBuffer.length === 0) {
        throw new Error("Excel file is empty");
      }

      // Read from buffer instead of file path
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      console.log("⏱️ File read successfully from buffer");

      const sheetNames = workbook.SheetNames;
      const sheets = {};

      if (sheetNames.length === 0) {
        throw new Error("No sheets found in Excel file");
      }

      // Process each sheet
      sheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: null,
          raw: false,
          dateNF: "yyyy-mm-dd", // Handle dates properly
        });

        if (jsonData.length > 0) {
          const headers = Object.keys(jsonData[0]);
          const columns = headers.map((header) => {
            const sampleValues = jsonData.slice(0, 5).map((row) => row[header]);
            return {
              name: header,
              type: this.inferDataType(sampleValues),
              sample: sampleValues[0],
            };
          });

          sheets[sheetName] = {
            headers,
            data: jsonData,
            columns,
            rowCount: jsonData.length,
          };
        }
      });

      console.log("✅ Excel file parsed successfully");
      console.log("📊 Sheets found:", sheetNames.length);
      console.log(
        "📋 Total rows:",
        Object.values(sheets).reduce(
          (total, sheet) => total + sheet.rowCount,
          0
        )
      );

      return { sheetNames, sheets };
    } catch (error) {
      console.error("❌ Error parsing Excel file:", error.message);
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  // Helper method to wait for file to be accessible
  static async waitForFileAccess(filePath, maxAttempts = 10) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        // Check file stats
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
          throw new Error("File is empty or still being written");
        }

        // Try to open file for reading (this will fail if locked)
        const fd = fs.openSync(filePath, "r");
        fs.closeSync(fd);

        console.log(`✅ File accessible on attempt ${attempt}`);
        return true;
      } catch (error) {
        console.log(
          `⏳ File access attempt ${attempt}/${maxAttempts} failed:`,
          error.message
        );

        if (attempt === maxAttempts) {
          throw new Error(
            `File not accessible after ${maxAttempts} attempts: ${error.message}`
          );
        }

        // Wait before next attempt (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, attempt * 100));
      }
    }
  }

  static processChartData(data, xColumnIndex, yColumnIndex) {
    try {
      const processedData = [];
      for (let i = 0; i < Math.min(data.length, 1000); i++) {
        const row = data[i];
        const keys = Object.keys(row);
        if (xColumnIndex < keys.length && yColumnIndex < keys.length) {
          const xValue = row[keys[xColumnIndex]];
          const yValue = row[keys[yColumnIndex]];
          if (
            xValue !== null &&
            xValue !== undefined &&
            yValue !== null &&
            yValue !== undefined
          ) {
            processedData.push({
              x: xValue,
              y: parseFloat(yValue) || 0,
              label: String(xValue),
            });
          }
        }
      }
      return processedData;
    } catch (error) {
      console.error("❌ Error processing chart data:", error);
      throw new Error(`Failed to process chart data: ${error.message}`);
    }
  }

  static aggregateData(data, xColumnIndex, yColumnIndex, aggregation = "sum") {
    try {
      const aggregated = {};
      const keys = Object.keys(data[0] || {});

      if (xColumnIndex >= keys.length || yColumnIndex >= keys.length) {
        throw new Error("Invalid column indices");
      }

      data.forEach((row) => {
        const xValue = String(row[keys[xColumnIndex]] || "");
        const yValue = parseFloat(row[keys[yColumnIndex]]) || 0;
        if (xValue && !isNaN(yValue)) {
          if (!aggregated[xValue]) {
            aggregated[xValue] = { values: [], count: 0 };
          }
          aggregated[xValue].values.push(yValue);
          aggregated[xValue].count++;
        }
      });

      const result = Object.keys(aggregated).map((key) => {
        const values = aggregated[key].values;
        let aggregatedValue;
        switch (aggregation) {
          case "sum":
            aggregatedValue = values.reduce((sum, val) => sum + val, 0);
            break;
          case "average":
            aggregatedValue =
              values.reduce((sum, val) => sum + val, 0) / values.length;
            break;
          case "count":
            aggregatedValue = values.length;
            break;
          case "max":
            aggregatedValue = Math.max(...values);
            break;
          case "min":
            aggregatedValue = Math.min(...values);
            break;
          default:
            aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        }
        return {
          label: key,
          value: aggregatedValue,
          x: key,
          y: aggregatedValue,
        };
      });
      return result.slice(0, 20);
    } catch (error) {
      console.error("❌ Error aggregating data:", error);
      throw new Error(`Failed to aggregate data: ${error.message}`);
    }
  }

  static inferDataType(values) {
    const nonNullValues = values.filter(
      (v) => v !== null && v !== undefined && v !== ""
    );
    if (nonNullValues.length === 0) return "string";

    const hasNumbers = nonNullValues.some(
      (v) => !isNaN(v) && !isNaN(parseFloat(v))
    );
    const hasStrings = nonNullValues.some(
      (v) => isNaN(v) || isNaN(parseFloat(v))
    );

    if (hasNumbers && !hasStrings) return "number";
    if (!hasNumbers && hasStrings) return "string";
    return "mixed";
  }
}

export default ExcelService;
