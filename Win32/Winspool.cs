using System.ComponentModel;
using System.Text;

//  Reference: https://www.pinvoke.net
namespace PInvoke
{
    using System;
    using System.Runtime.InteropServices;

    [FlagsAttribute]
    public enum PrinterEnumFlags
    {
        PRINTER_ENUM_DEFAULT = 0x00000001,
        PRINTER_ENUM_LOCAL = 0x00000002,
        PRINTER_ENUM_CONNECTIONS = 0x00000004,
        PRINTER_ENUM_FAVORITE = 0x00000004,
        PRINTER_ENUM_NAME = 0x00000008,
        PRINTER_ENUM_REMOTE = 0x00000010,
        PRINTER_ENUM_SHARED = 0x00000020,
        PRINTER_ENUM_NETWORK = 0x00000040,
        PRINTER_ENUM_EXPAND = 0x00004000,
        PRINTER_ENUM_CONTAINER = 0x00008000,
        PRINTER_ENUM_ICONMASK = 0x00ff0000,
        PRINTER_ENUM_ICON1 = 0x00010000,
        PRINTER_ENUM_ICON2 = 0x00020000,
        PRINTER_ENUM_ICON3 = 0x00040000,
        PRINTER_ENUM_ICON4 = 0x00080000,
        PRINTER_ENUM_ICON5 = 0x00100000,
        PRINTER_ENUM_ICON6 = 0x00200000,
        PRINTER_ENUM_ICON7 = 0x00400000,
        PRINTER_ENUM_ICON8 = 0x00800000,
        PRINTER_ENUM_HIDE = 0x01000000,
        PRINTER_ENUM_CATEGORY_ALL = 0x02000000,
        PRINTER_ENUM_CATEGORY_3D = 0x04000000
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    public struct PRINTER_INFO_2
    {
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pServerName;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pPrinterName;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pShareName;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pPortName;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pDriverName;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pComment;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pLocation;
        public IntPtr pDevMode;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pSepFile;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pPrintProcessor;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pDatatype;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pParameters;
        public IntPtr pSecurityDescriptor;
        public uint Attributes; // See note below!
        public uint Priority;
        public uint DefaultPriority;
        public uint StartTime;
        public uint UntilTime;
        public uint Status;
        public uint cJobs;
        public uint AveragePPM;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct DOCINFOW
    {
        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDocName;
        [MarshalAs(UnmanagedType.LPWStr)]
        public string pOutputFile;
        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDataType;
    }

    public static class Winspool
    {
        [DllImport("winspool.Drv", EntryPoint = "GetDefaultPrinterW", SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool GetDefaultPrinter(StringBuilder pszBuilder, ref int size);

        [DllImport("winspool.Drv", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern bool EnumPrinters(PrinterEnumFlags flags, string name, uint Level, IntPtr pPrinterEnum,
            uint cbBuf, ref uint pcbNeeded, ref uint pcReturned);

        [DllImport("winspool.Drv", EntryPoint = "OpenPrinterW",
            SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool OpenPrinter(string src, ref IntPtr hPrinter, IntPtr pd);

        [DllImport("winspool.Drv", EntryPoint = "ClosePrinter",
            SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool ClosePrinter(IntPtr hPrinter);

        [DllImport("winspool.Drv", EntryPoint = "StartDocPrinterW",
            SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool StartDocPrinter(IntPtr hPrinter, int level, ref DOCINFOW pDI);

        [DllImport("winspool.Drv", EntryPoint = "EndDocPrinter",
            SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool EndDocPrinter(IntPtr hPrinter);

        [DllImport("winspool.Drv", EntryPoint = "StartPagePrinter",
            SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool StartPagePrinter(IntPtr hPrinter);

        [DllImport("winspool.Drv", EntryPoint = "EndPagePrinter",
            SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool EndPagePrinter(IntPtr hPrinter);

        [DllImport("winspool.Drv", EntryPoint = "WritePrinter",
            SetLastError = true, CharSet = CharSet.Unicode,
            ExactSpelling = true, CallingConvention = CallingConvention.StdCall)]
        private static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, ref int dwWRitten);

        // Public interface to winspool.Drv
        private const int ERROR_INSUFFICIENT_BUFFER = 122;
        private const int ERROR_FILE_NOT_FOUND = 2;

        /// <summary>
        /// Retrieves the printer name of the default printer for the current user on the local computer.
        /// </summary>
        /// <returns>String: Default printer name</returns>
        public static String GetDefaultPrinter()
        {
            int pcchBuffer = 0;
            if (GetDefaultPrinter(null, ref pcchBuffer))
            {
                return null;
            }
            int lastWin32Error = Marshal.GetLastWin32Error();
            if (lastWin32Error == ERROR_INSUFFICIENT_BUFFER)
            {
                StringBuilder pszBuffer = new StringBuilder(pcchBuffer);
                if (GetDefaultPrinter(pszBuffer, ref pcchBuffer))
                {
                    return pszBuffer.ToString();
                }
                lastWin32Error = Marshal.GetLastWin32Error();
            }
            if (lastWin32Error == ERROR_FILE_NOT_FOUND)
            {
                return null;
            }
            throw new Win32Exception(Marshal.GetLastWin32Error());
        }

        /// <summary>
        /// Retrieves a list of printers filtered by the specified flags.
        /// </summary>
        /// <param name="flags">Example: PrinterEnumFlags.PRINTER_ENUM_LOCAL | PrinterEnumFlags.PRINTER_ENUM_REMOTE</param>
        /// <returns>PRINTER_INFO_2[]: Array of printer information</returns>
        public static PRINTER_INFO_2[] EnumPrinters(PrinterEnumFlags flags)
        {
            uint cbNeeded = 0;
            uint cReturned = 0;
            if (EnumPrinters(flags, null, 2, IntPtr.Zero, 0, ref cbNeeded, ref cReturned))
            {
                return null;
            }
            int lastWin32Error = Marshal.GetLastWin32Error();
            if (lastWin32Error == ERROR_INSUFFICIENT_BUFFER)
            {
                IntPtr pAddr = Marshal.AllocHGlobal((int)cbNeeded);
                if (EnumPrinters(flags, null, 2, pAddr, cbNeeded, ref cbNeeded, ref cReturned))
                {
                    PRINTER_INFO_2[] printerInfo2 = new PRINTER_INFO_2[cReturned];
                    var offset = pAddr.ToInt64();
                    Type type = typeof(PRINTER_INFO_2);
                    int increment = Marshal.SizeOf(type);
                    for (int i = 0; i < cReturned; i++)
                    {
                        printerInfo2[i] = (PRINTER_INFO_2)Marshal.PtrToStructure(new IntPtr(offset), type);
                        offset += increment;
                    }
                    Marshal.FreeHGlobal(pAddr);
                    return printerInfo2;
                }
                lastWin32Error = Marshal.GetLastWin32Error();
            }
            throw new Win32Exception(lastWin32Error);
        }

        /// <summary>
        /// Send a buffer to a printer spool.
        /// </summary>
        /// <param name="printerName"></param>
        /// <param name="pBytes"></param>
        /// <param name="dwCount"></param>
        /// <returns>bool: Success(true) or Fail(false)</returns>
        private static bool SendBytesToPrinter(string printerName, IntPtr pBytes, Int32 dwCount)
        {
            DOCINFOW di = new DOCINFOW();
            di.pDocName = "LABEL";
            di.pDataType = "RAW";

            bool bSuccess = false;
            try
            {
                IntPtr hPrinter = IntPtr.Zero;
                if (OpenPrinter(printerName, ref hPrinter, IntPtr.Zero))
                {
                    if (StartDocPrinter(hPrinter, 1, ref di))
                    {
                        if (StartPagePrinter(hPrinter))
                        {
                            Int32 dwWritten = 0;
                            bSuccess = WritePrinter(hPrinter, pBytes, dwCount, ref dwWritten);
                            EndPagePrinter(hPrinter);
                        }
                        EndDocPrinter(hPrinter);
                    }
                    ClosePrinter(hPrinter);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Print failed.", ex);
            }
            return bSuccess;
        }

        /// <summary>
        /// Sends a document to a named printer.
        /// </summary>
        /// <param name="printerName">Name of the printer</param>
        /// <param name="document">Raw document</param>
        /// <returns>bool: Success(true) or Fail(false)</returns>
        public static bool Print(string printerName, string document)
        {
            IntPtr pBytes = Marshal.StringToCoTaskMemAnsi(document);
            Int32 dwCount = document.Length;
            bool result = SendBytesToPrinter(printerName, pBytes, dwCount);
            Marshal.FreeCoTaskMem(pBytes);
            return result;
        }
    }
}
