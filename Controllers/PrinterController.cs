using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PInvoke;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Threading;

public class PrinterInfo
{
    public string PrinterName { get; set; }
    public string PrinterDriver { get; set; }
    public string ServerName { get; set; }
    public string ShareName { get; set; }
    public string PortName { get; set; }
    public string Comment { get; set; }
    public string Location { get; set; }
    public string SepFile { get; set; }
    public string PrintProcessor { get; set; }
    public string DataType { get; set; }
    public string Parameters { get; set; }
    public uint Attributes { get; set; }
    public uint Priority { get; set; }
    public uint DefaultPriority { get; set; }
    public uint StartTime { get; set; }
    public uint UntilTime { get; set; }
    public uint Status { get; set; }
    public uint cJobs { get; set; }
    public uint AveragePPM { get; set; }
}

[ApiController]
public class PrinterController : ControllerBase
{
    private static long lastTimeStamp = DateTime.UtcNow.Ticks;
    public static long UtcNowTicks
    {
        get
        {
            long original, newValue;
            do
            {
                original = lastTimeStamp;
                long now = DateTime.UtcNow.Ticks;
                newValue = Math.Max(now, original + 1);
            } while (Interlocked.CompareExchange
                         (ref lastTimeStamp, newValue, original) != original);

            return newValue;
        }
    }
    public string CurrentPrinter
    {
        get
        {
            try
            {
                var jsonString = System.IO.File.ReadAllText("localSettings.json");
                var currentPrinter = JsonSerializer.Deserialize<PrinterInfo>(jsonString);
                return currentPrinter.PrinterName;
            }
            catch
            {
                return Winspool.GetDefaultPrinter();
            }
        }
        set
        {
            var currentPrinter = (PrinterInfo)null;
            try
            {
                currentPrinter = Winspool.EnumPrinters(PrinterEnumFlags.PRINTER_ENUM_LOCAL)
                .Select(p => new PrinterInfo
                {
                    PrinterName = p.pPrinterName?.Trim(),
                    PrinterDriver = p.pDriverName?.Trim(),
                    ServerName = p.pServerName?.Trim(),
                    ShareName = p.pShareName?.Trim(),
                    PortName = p.pPortName?.Trim(),
                    Comment = p.pComment?.Trim(),
                    Location = p.pLocation?.Trim(),
                    SepFile = p.pSepFile?.Trim(),
                    PrintProcessor = p.pPrintProcessor?.Trim(),
                    DataType = p.pDatatype?.Trim(),
                    Parameters = p.pParameters?.Trim(),
                    Attributes = p.Attributes,
                    Priority = p.Priority,
                    DefaultPriority = p.DefaultPriority,
                    StartTime = p.StartTime,
                    UntilTime = p.UntilTime,
                    Status = p.Status,
                    cJobs = p.cJobs,
                    AveragePPM = p.AveragePPM
                })
                .ToList().Single(p => p.PrinterName == value);
            }
            catch
            {
                currentPrinter = Winspool.EnumPrinters(PrinterEnumFlags.PRINTER_ENUM_LOCAL)
                .Select(p => new PrinterInfo
                {
                    PrinterName = p.pPrinterName?.Trim(),
                    PrinterDriver = p.pDriverName?.Trim(),
                    ServerName = p.pServerName?.Trim(),
                    ShareName = p.pShareName?.Trim(),
                    PortName = p.pPortName?.Trim(),
                    Comment = p.pComment?.Trim(),
                    Location = p.pLocation?.Trim(),
                    SepFile = p.pSepFile?.Trim(),
                    PrintProcessor = p.pPrintProcessor?.Trim(),
                    DataType = p.pDatatype?.Trim(),
                    Parameters = p.pParameters?.Trim(),
                    Attributes = p.Attributes,
                    Priority = p.Priority,
                    DefaultPriority = p.DefaultPriority,
                    StartTime = p.StartTime,
                    UntilTime = p.UntilTime,
                    Status = p.Status,
                    cJobs = p.cJobs,
                    AveragePPM = p.AveragePPM
                })
                .ToList().Single(p => p.PrinterName == Winspool.GetDefaultPrinter());
            }

            var jsonString = JsonSerializer.Serialize(currentPrinter);
            System.IO.File.WriteAllText("localSettings.json", jsonString);
        }
    }

    private readonly IConfiguration _configuration;
    public PrinterController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("api/printerlist")]
    public ActionResult<IEnumerable<PrinterInfo>> GetAll()
    {
        return Winspool.EnumPrinters(PrinterEnumFlags.PRINTER_ENUM_LOCAL)
            .Select(p => new PrinterInfo
            {
                PrinterName = p.pPrinterName?.Trim(),
                PrinterDriver = p.pDriverName?.Trim(),
                ServerName = p.pServerName?.Trim(),
                ShareName = p.pShareName?.Trim(),
                PortName = p.pPortName?.Trim(),
                Comment = p.pComment?.Trim(),
                Location = p.pLocation?.Trim(),
                SepFile = p.pSepFile?.Trim(),
                PrintProcessor = p.pPrintProcessor?.Trim(),
                DataType = p.pDatatype?.Trim(),
                Parameters = p.pParameters?.Trim(),
                Attributes = p.Attributes,
                Priority = p.Priority,
                DefaultPriority = p.DefaultPriority,
                StartTime = p.StartTime,
                UntilTime = p.UntilTime,
                Status = p.Status,
                cJobs = p.cJobs,
                AveragePPM = p.AveragePPM
            })
            .ToList();
    }

    [HttpGet("api/currentprinter")]
    public ActionResult<PrinterInfo> GetCurrent()
    {

        return Winspool.EnumPrinters(PrinterEnumFlags.PRINTER_ENUM_LOCAL)
        .Select(p => new PrinterInfo
        {
            PrinterName = p.pPrinterName?.Trim(),
            PrinterDriver = p.pDriverName?.Trim(),
            ServerName = p.pServerName?.Trim(),
            ShareName = p.pShareName?.Trim(),
            PortName = p.pPortName?.Trim(),
            Comment = p.pComment?.Trim(),
            Location = p.pLocation?.Trim(),
            SepFile = p.pSepFile?.Trim(),
            PrintProcessor = p.pPrintProcessor?.Trim(),
            DataType = p.pDatatype?.Trim(),
            Parameters = p.pParameters?.Trim(),
            Attributes = p.Attributes,
            Priority = p.Priority,
            DefaultPriority = p.DefaultPriority,
            StartTime = p.StartTime,
            UntilTime = p.UntilTime,
            Status = p.Status,
            cJobs = p.cJobs,
            AveragePPM = p.AveragePPM
        })
        .ToList().Single(p => p.PrinterName == CurrentPrinter);
    }

    [HttpPatch("api/setcurrentprinter")]
    public ActionResult<bool> SetCurrent([FromQuery] string printerName)
    {
        CurrentPrinter = printerName;
        return CurrentPrinter == printerName;
    }

    [HttpPost("api/printlabel")]
    public async Task<bool> PrintLabel()
    {
        try
        {
            using (var ms = new MemoryStream(2048))
            {
                await Request.Body.CopyToAsync(ms);
                var printData = Encoding.ASCII.GetString(ms.ToArray());
                Winspool.Print(CurrentPrinter, printData);
                System.IO.File.WriteAllText($@"\debug\printjob{UtcNowTicks}.json", printData);
            }
        }
        catch
        {
            return false;
        }
        return true;
    }
}