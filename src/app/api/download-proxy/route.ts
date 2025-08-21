import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, filename } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    // Prepare headers for the proxied request
    const headers: HeadersInit = {
      'Accept': '*/*',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    };

    // Add authorization if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Fetch the file from the original URL
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the file content
    const buffer = await response.arrayBuffer();
    
    // Determine content type
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // Extract filename from Content-Disposition header if available
    let downloadFilename = filename;
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition && !downloadFilename) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        downloadFilename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    if (!downloadFilename) {
      const urlParts = url.split('/');
      downloadFilename = urlParts[urlParts.length - 1].split('?')[0] || 'download';
    }

    // Return the file with appropriate headers to force download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`, // Force download
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Additional headers to prevent browser from trying to display the file
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 